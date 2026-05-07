import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";

import { getDatasets, runAnalytics } from "../api/api";
import MetricCard from "../components/MetricCard";
import RiskGauge from "../components/RiskGauge";

type DatasetRecord = {
  _id: string;
  name: string;
};

type AnalyticsResult = {
  mean?: number;
  volatility?: number;
  var95?: number;
  sharpeRatio?: number;
  riskScore?: number;
};

export default function ComparePage() {
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [leftMetrics, setLeftMetrics] = useState<AnalyticsResult | null>(null);
  const [rightMetrics, setRightMetrics] = useState<AnalyticsResult | null>(null);
  const [loadingSide, setLoadingSide] = useState<"left" | "right" | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        setError("");
        const res = await getDatasets();
        setDatasets(Array.isArray(res?.data) ? res.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load datasets.");
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, []);

  const loadAnalytics = async (side: "left" | "right", id: string) => {
    try {
      setError("");
      setLoadingSide(side);

      const res = await runAnalytics(id);
      const metrics = res?.data || null;

      if (side === "left") {
        setLeftId(id);
        setLeftMetrics(metrics);
      } else {
        setRightId(id);
        setRightMetrics(metrics);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to run analytics.");
    } finally {
      setLoadingSide(null);
    }
  };

  const handleLeftChange = (e: SelectChangeEvent<string>) => {
    const id = e.target.value;
    loadAnalytics("left", id);
  };

  const handleRightChange = (e: SelectChangeEvent<string>) => {
    const id = e.target.value;
    loadAnalytics("right", id);
  };

  const leftDatasetName =
    datasets.find((d) => d._id === leftId)?.name || "Left Dataset";
  const rightDatasetName =
    datasets.find((d) => d._id === rightId)?.name || "Right Dataset";

  return (
    <>
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Left Dataset
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="left-dataset-label">Select dataset</InputLabel>
            <Select
              labelId="left-dataset-label"
              id="left-dataset-select"
              value={leftId}
              label="Select dataset"
              onChange={handleLeftChange}
            >
              {datasets.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Right Dataset
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="right-dataset-label">Select dataset</InputLabel>
            <Select
              labelId="right-dataset-label"
              id="right-dataset-select"
              value={rightId}
              label="Select dataset"
              onChange={handleRightChange}
            >
              {datasets.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>
      </Box>

      {(pageLoading || loadingSide) && (
        <Card sx={{ p: 3, mb: 3, textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>
            {pageLoading ? "Loading datasets..." : "Loading comparison..."}
          </Typography>
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
              Left: {leftDatasetName}
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
                tone="success"
              />
              <MetricCard
                title="Volatility"
                value={Number(leftMetrics.volatility ?? 0).toFixed(4)}
                tone="warning"
              />
              <MetricCard
                title="VaR 95%"
                value={Number(leftMetrics.var95 ?? 0).toFixed(4)}
                tone="error"
              />
              <MetricCard
                title="Sharpe"
                value={Number(leftMetrics.sharpeRatio ?? 0).toFixed(4)}
                tone="info"
              />
            </Box>

            <RiskGauge riskScore={Number(leftMetrics.riskScore ?? 0)} />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Right: {rightDatasetName}
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
                tone="success"
              />
              <MetricCard
                title="Volatility"
                value={Number(rightMetrics.volatility ?? 0).toFixed(4)}
                tone="warning"
              />
              <MetricCard
                title="VaR 95%"
                value={Number(rightMetrics.var95 ?? 0).toFixed(4)}
                tone="error"
              />
              <MetricCard
                title="Sharpe"
                value={Number(rightMetrics.sharpeRatio ?? 0).toFixed(4)}
                tone="info"
              />
            </Box>

            <RiskGauge riskScore={Number(rightMetrics.riskScore ?? 0)} />
          </Box>
        </Box>
      )}
    </>
  );
}