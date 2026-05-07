import { useMemo, useState } from "react";
import { Card, Typography, Box, Grid, MenuItem, Select } from "@mui/material";

type Props = {
  portfolioMetrics: {
    mean?: number;
    volatility?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
  } | null;
};

const benchmarkOptions = {
  nifty50: {
    label: "NIFTY 50",
    mean: 0.0115,
    volatility: 0.082,
    sharpeRatio: 0.91,
    maxDrawdown: -0.145,
  },
  sensex: {
    label: "SENSEX",
    mean: 0.0108,
    volatility: 0.079,
    sharpeRatio: 0.88,
    maxDrawdown: -0.138,
  },
  niftyNext50: {
    label: "NIFTY NEXT 50",
    mean: 0.0132,
    volatility: 0.094,
    sharpeRatio: 0.84,
    maxDrawdown: -0.172,
  },
};

function formatValue(value: number, digits = 4) {
  return Number(value ?? 0).toFixed(digits);
}

function getDeltaColor(portfolio: number, benchmark: number, inverse = false) {
  const better = inverse ? portfolio < benchmark : portfolio > benchmark;
  return better ? "#16a34a" : "#dc2626";
}

export default function BenchmarkComparisonCard({ portfolioMetrics }: Props) {
  const [selectedBenchmark, setSelectedBenchmark] =
    useState<keyof typeof benchmarkOptions>("nifty50");

  const benchmark = useMemo(
    () => benchmarkOptions[selectedBenchmark],
    [selectedBenchmark]
  );

  if (!portfolioMetrics) return null;

  const comparisons = [
    {
      label: "Mean Return",
      portfolio: Number(portfolioMetrics.mean ?? 0),
      benchmark: benchmark.mean,
      inverse: false,
    },
    {
      label: "Volatility",
      portfolio: Number(portfolioMetrics.volatility ?? 0),
      benchmark: benchmark.volatility,
      inverse: true,
    },
    {
      label: "Sharpe Ratio",
      portfolio: Number(portfolioMetrics.sharpeRatio ?? 0),
      benchmark: benchmark.sharpeRatio,
      inverse: false,
    },
    {
      label: "Max Drawdown",
      portfolio: Math.abs(Number(portfolioMetrics.maxDrawdown ?? 0)),
      benchmark: Math.abs(benchmark.maxDrawdown),
      inverse: true,
    },
  ];

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
      }}
    >
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Benchmark Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compare portfolio performance against a selected market index.
          </Typography>
        </Box>

        <Select
          value={selectedBenchmark}
          onChange={(e) =>
            setSelectedBenchmark(
              e.target.value as keyof typeof benchmarkOptions
            )
          }
          size="small"
          sx={{ minWidth: 200, backgroundColor: "#0f172a", color: "#e5e7eb" }}
        >
          <MenuItem value="nifty50">NIFTY 50</MenuItem>
          <MenuItem value="sensex">SENSEX</MenuItem>
          <MenuItem value="niftyNext50">NIFTY NEXT 50</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2}>
        {comparisons.map((item) => {
          const delta = item.portfolio - item.benchmark;
          const color = getDeltaColor(
            item.portfolio,
            item.benchmark,
            item.inverse
          );

          return (
            <Grid key={item.label} size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                  backgroundColor: "rgba(248, 250, 252, 0.95)",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                  Portfolio: {formatValue(item.portfolio)}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  {benchmark.label}: {formatValue(item.benchmark)}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 800,
                    color,
                  }}
                >
                  Delta: {delta >= 0 ? "+" : ""}
                  {formatValue(delta)}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
}