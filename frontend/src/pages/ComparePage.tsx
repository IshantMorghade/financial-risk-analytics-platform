import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import MainLayout from "../layouts/MainLayout";
import { getDatasets, runAnalytics } from "../api/api";
import MetricCard from "../components/MetricCard";
import RiskGauge from "../components/RiskGauge";

export default function ComparePage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [leftId, setLeftId] = useState<string>("");
  const [rightId, setRightId] = useState<string>("");
  const [leftMetrics, setLeftMetrics] = useState<any>(null);
  const [rightMetrics, setRightMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDatasets();
        setDatasets(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load datasets");
      }
    };
    load();
  }, []);

  const loadAnalytics = async (side: "left" | "right", id: string) => {
    try {
      setError("");
      setLoading(true);
      const res = await runAnalytics(id);

      if (side === "left") {
        setLeftId(id);
        setLeftMetrics(res.data || null);
      } else {
        setRightId(id);
        setRightMetrics(res.data || null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to run analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Dataset Comparison
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Left Dataset
          </Typography>
          <Select
            fullWidth
            value={leftId || ""}
            displayEmpty
            onChange={(e) => loadAnalytics("left", e.target.value as string)}
          >
            <MenuItem value="" disabled>
              Select dataset
            </MenuItem>
            {datasets.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Right Dataset
          </Typography>
          <Select
            fullWidth
            value={rightId || ""}
            displayEmpty
            onChange={(e) => loadAnalytics("right", e.target.value as string)}
          >
            <MenuItem value="" disabled>
              Select dataset
            </MenuItem>
            {datasets.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </Card>
      </Box>

      {loading && (
        <Card sx={{ p: 3, mb: 3, textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading comparison...</Typography>
        </Card>
      )}

      {leftMetrics && rightMetrics && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Left: {datasets.find((d) => d._id === leftId)?.name}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 2,
              }}
            >
              <MetricCard
                title="Mean Return"
                value={Number(leftMetrics.mean ?? 0).toFixed(4)}
              />
              <MetricCard
                title="Volatility"
                value={Number(leftMetrics.volatility ?? 0).toFixed(4)}
                color="#f59e0b"
              />
              <MetricCard
                title="VaR 95%"
                value={Number(leftMetrics.var95 ?? 0).toFixed(4)}
                color="#ef4444"
              />
              <MetricCard
                title="Sharpe"
                value={Number(leftMetrics.sharpeRatio ?? 0).toFixed(4)}
                color="#2563eb"
              />
            </Box>

            <RiskGauge riskScore={Number(leftMetrics.riskScore ?? 0)} />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Right: {datasets.find((d) => d._id === rightId)?.name}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 2,
              }}
            >
              <MetricCard
                title="Mean Return"
                value={Number(rightMetrics.mean ?? 0).toFixed(4)}
              />
              <MetricCard
                title="Volatility"
                value={Number(rightMetrics.volatility ?? 0).toFixed(4)}
                color="#f59e0b"
              />
              <MetricCard
                title="VaR 95%"
                value={Number(rightMetrics.var95 ?? 0).toFixed(4)}
                color="#ef4444"
              />
              <MetricCard
                title="Sharpe"
                value={Number(rightMetrics.sharpeRatio ?? 0).toFixed(4)}
                color="#2563eb"
              />
            </Box>

            <RiskGauge riskScore={Number(rightMetrics.riskScore ?? 0)} />
          </Box>
        </Box>
      )}
    </MainLayout>
  );
}