import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDatasets, runAnalytics, downloadCsvReport } from "../api/api";
import MetricCard from "../components/MetricCard";
import RiskGauge from "../components/RiskGauge";
import RiskTrendChart from "../components/RiskTrendChart";
import DrawdownChart from "../components/DrawdownChart";
import ScenarioCard from "../components/ScenarioCard";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import BenchmarkComparisonCard from "../components/BenchmarkComparisonCard";
import StressTestCard from "../components/StressTestCard";

type DatasetRow = {
  date?: string;
  price?: number | string;
  [key: string]: any;
};

type Dataset = {
  _id: string;
  name: string;
  data?: DatasetRow[];
};

type Metrics = {
  mean?: number;
  volatility?: number;
  var95?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  riskScore?: number;
  stressedVar95?: number;
  rollingVolatility?: { date: string; rollingVolatility: number }[];
  drawdownSeries?: { date: string; drawdown: number }[];
  alerts?: string[];
};

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoadingDatasets(true);
        setError("");

        const res = await getDatasets();
        const datasetList = res?.data || [];

        setDatasets(datasetList);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load datasets.");
      } finally {
        setIsLoadingDatasets(false);
      }
    };

    fetchDatasets();
  }, []);

  const handleDatasetChange = async (datasetId: string) => {
    try {
      setSelectedDatasetId(datasetId);
      setError("");
      setIsLoadingAnalytics(true);

      const dataset = datasets.find((d) => d._id === datasetId) || null;
      setSelectedDataset(dataset);

      const res = await runAnalytics(datasetId);
      setMetrics(res?.data || null);
    } catch (err: any) {
      setMetrics(null);
      setError(err?.response?.data?.message || "Failed to run analytics.");
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      if (!selectedDatasetId) return;
      await downloadCsvReport(selectedDatasetId);
    } catch (err) {
      console.error("CSV export failed:", err);
      setError("CSV export failed.");
    }
  };

  const riskScore = Number(metrics?.riskScore ?? 0);

  const riskLabel = useMemo(() => {
    if (riskScore >= 7) return "High";
    if (riskScore >= 4) return "Moderate";
    return "Safe";
  }, [riskScore]);

  const executiveSummary = useMemo(() => {
    if (!metrics) return "Select a dataset to generate analytics.";

    if (riskScore >= 7) {
      return "Portfolio risk appears elevated. Review volatility, downside exposure, and scenario sensitivity before taking further allocation decisions.";
    }

    if (riskScore >= 4) {
      return "Portfolio risk is in a moderate zone. Monitor drawdown behavior, rolling volatility, and stressed VaR for changes in risk posture.";
    }

    return "Portfolio risk is currently within a relatively safer band based on the computed metrics and available historical observations.";
  }, [metrics, riskScore]);

  const priceTrendData = useMemo(() => {
    if (!selectedDataset?.data?.length) return [];

    return selectedDataset.data.map((row, index) => ({
      date: row?.date
        ? new Date(row.date).toISOString().slice(0, 10)
        : `Point ${index + 1}`,
      price: Number(row?.price ?? 0),
    }));
  }, [selectedDataset]);

  const handleExportPdf = () => {
    if (!metrics || !selectedDataset) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Financial Risk Dashboard Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Dataset: ${selectedDataset.name || selectedDataset._id}`, 14, 28);
    doc.text(`Overall Risk Posture: ${riskLabel}`, 14, 35);

    doc.setFontSize(12);
    doc.text("Executive Summary", 14, 46);

    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(executiveSummary, 180);
    doc.text(summaryLines, 14, 53);

    autoTable(doc, {
      startY: 60 + summaryLines.length * 4,
      head: [["Metric", "Value"]],
      body: [
        ["Mean Return", Number(metrics.mean ?? 0).toFixed(4)],
        ["Volatility", Number(metrics.volatility ?? 0).toFixed(4)],
        ["VaR 95%", Number(metrics.var95 ?? 0).toFixed(4)],
        ["Sharpe Ratio", Number(metrics.sharpeRatio ?? 0).toFixed(4)],
        ["Max Drawdown", Number(metrics.maxDrawdown ?? 0).toFixed(4)],
        ["Risk Score", Number(metrics.riskScore ?? 0).toFixed(2)],
        ["Stressed VaR 95%", Number(metrics.stressedVar95 ?? 0).toFixed(4)],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [15, 23, 42] },
    });

    const nextY =
      (doc as any).lastAutoTable?.finalY != null
        ? (doc as any).lastAutoTable.finalY + 10
        : 110;

    doc.setFontSize(12);
    doc.text("Alerts", 14, nextY);

    if (metrics.alerts?.length) {
      autoTable(doc, {
        startY: nextY + 4,
        head: [["#", "Alert"]],
        body: metrics.alerts.map((alert, index) => [index + 1, alert]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [127, 29, 29] },
      });
    } else {
      doc.setFontSize(10);
      doc.text("No alerts currently. Metrics are within safer thresholds.", 14, nextY + 8);
    }

    const safeName = (selectedDataset.name || selectedDataset._id).replace(/\s+/g, "_");
    doc.save(`risk_report_${safeName}.pdf`);
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", pb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
          Financial Risk Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Analyze portfolio behavior, benchmark performance, scenario exposure, and risk trends.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          p: 2.5,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          borderRadius: 3,
        }}
      >
        <Select
          value={selectedDatasetId}
          onChange={(e) => handleDatasetChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 260 }}
        >
          <MenuItem value="" disabled>
            Select Dataset
          </MenuItem>

          {datasets.map((dataset) => (
            <MenuItem key={dataset._id} value={dataset._id}>
              {dataset.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="outlined"
          onClick={handleExportCsv}
          disabled={!selectedDatasetId}
        >
          Export CSV
        </Button>

        <Button
          variant="contained"
          onClick={handleExportPdf}
          disabled={!selectedDatasetId || !metrics}
        >
          Export PDF
        </Button>

        {isLoadingDatasets && <CircularProgress size={24} />}
      </Card>

      {!selectedDatasetId && !isLoadingDatasets && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Choose a dataset to load analytics and view risk insights.
        </Alert>
      )}

      {isLoadingAnalytics && (
        <Card
          sx={{
            p: 3,
            mb: 3,
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1">Running analytics...</Typography>
        </Card>
      )}

      {metrics && !isLoadingAnalytics && (
        <>
          <Card
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid rgba(59, 130, 246, 0.18)",
              background:
                "linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              Executive Summary
            </Typography>
            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Overall Risk Posture: <strong>{riskLabel}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {executiveSummary}
            </Typography>
          </Card>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <MetricCard
                title="Mean Return"
                value={Number(metrics.mean ?? 0).toFixed(4)}
                subtitle="Average return across observations."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricCard
                title="Volatility"
                value={Number(metrics.volatility ?? 0).toFixed(4)}
                subtitle="Measures fluctuation intensity."
                tone="warning"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricCard
                title="VaR 95%"
                value={Number(metrics.var95 ?? 0).toFixed(4)}
                subtitle="Estimated downside threshold."
                tone="error"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricCard
                title="Sharpe Ratio"
                value={Number(metrics.sharpeRatio ?? 0).toFixed(4)}
                subtitle="Risk-adjusted performance."
                tone="info"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Max Drawdown"
                value={Number(metrics.maxDrawdown ?? 0).toFixed(4)}
                subtitle="Largest peak-to-trough decline."
                tone="error"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Risk Score"
                value={Number(metrics.riskScore ?? 0).toFixed(2)}
                subtitle="Normalized 0 to 10 risk score."
                tone={
                  riskScore >= 7
                    ? "error"
                    : riskScore >= 4
                    ? "warning"
                    : "success"
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Stressed VaR 95%"
                value={Number(metrics.stressedVar95 ?? 0).toFixed(4)}
                subtitle="Stress-adjusted downside estimate."
                tone="warning"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <RiskGauge riskScore={riskScore} />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <ScenarioCard
                baseVar={Number(metrics.var95 ?? 0)}
                stressedVar={Number(metrics.stressedVar95 ?? 0)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <RiskTrendChart data={metrics.rollingVolatility || []} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DrawdownChart data={metrics.drawdownSeries || []} />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }}>
              <StressTestCard
                baseVar={Number(metrics.var95 ?? 0)}
                volatility={Number(metrics.volatility ?? 0)}
                maxDrawdown={Number(metrics.maxDrawdown ?? 0)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }}>
              <BenchmarkComparisonCard
                portfolioMetrics={{
                  mean: Number(metrics.mean ?? 0),
                  volatility: Number(metrics.volatility ?? 0),
                  sharpeRatio: Number(metrics.sharpeRatio ?? 0),
                  maxDrawdown: Number(metrics.maxDrawdown ?? 0),
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }}>
              <CorrelationHeatmap data={selectedDataset?.data || []} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  p: 2.5,
                  height: 360,
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    Price Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Historical price movement from the uploaded dataset.
                  </Typography>
                </Box>

                {priceTrendData.length === 0 ? (
                  <Box
                    sx={{
                      height: 260,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    No price trend data available.
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="78%">
                    <LineChart
                      data={priceTrendData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.25)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(148,163,184,0.18)",
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                        }}
                        formatter={(value) => [Number(value).toFixed(2), "Price"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 2.5,
                  height: 360,
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
                  Alerts & Observations
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Automated highlights based on current portfolio metrics.
                </Typography>

                {metrics.alerts?.length ? (
                  <List dense sx={{ pt: 0 }}>
                    {metrics.alerts.map((alert, index) => (
                      <ListItem
                        key={`${alert}-${index}`}
                        sx={{
                          px: 0,
                          py: 0.75,
                          alignItems: "flex-start",
                        }}
                      >
                        <ListItemText
                          primary={alert}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      height: 240,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    No alerts triggered. Portfolio metrics are within safer thresholds.
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}