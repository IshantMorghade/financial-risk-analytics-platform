import { useMemo, useState } from "react";
import { Card, Typography, Box, Slider } from "@mui/material";

type Props = {
  baseVar?: number;
  volatility?: number;
  maxDrawdown?: number;
};

function formatValue(value: number, digits = 4) {
  return Number(value ?? 0).toFixed(digits);
}

export default function StressTestCard({
  baseVar = 0,
  volatility = 0,
  maxDrawdown = 0,
}: Props) {
  const [shockLevel, setShockLevel] = useState<number>(10);

  const stressedMetrics = useMemo(() => {
    const shockMultiplier = 1 + shockLevel / 100;

    const stressedVar = Number(baseVar) * shockMultiplier;
    const stressedVolatility = Number(volatility) * (1 + shockLevel / 120);
    const stressedDrawdown =
      Math.abs(Number(maxDrawdown)) * (1 + shockLevel / 90);

    return {
      stressedVar,
      stressedVolatility,
      stressedDrawdown,
    };
  }, [baseVar, volatility, maxDrawdown, shockLevel]);

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
      <Typography variant="h6" sx={{ mb: 1.25, fontWeight: 700, color: "#0f172a" }}>
        Interactive Stress Test
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Simulate adverse market shocks and see how VaR, volatility, and drawdown react.
      </Typography>

      <Box sx={{ px: 0.5, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Market Shock: <strong>{shockLevel}%</strong>
        </Typography>

        <Slider
          value={shockLevel}
          onChange={(_, value) => setShockLevel(value as number)}
          min={0}
          max={30}
          step={5}
          marks
          valueLabelDisplay="auto"
          aria-label="Market shock slider"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(226, 232, 240, 0.9)",
            backgroundColor: "rgba(254, 242, 242, 0.85)",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Stressed VaR
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: "#dc2626", fontWeight: 700 }}>
            {formatValue(stressedMetrics.stressedVar)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base VaR: {formatValue(baseVar)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(226, 232, 240, 0.9)",
            backgroundColor: "rgba(255, 251, 235, 0.9)",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Stressed Volatility
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: "#f59e0b", fontWeight: 700 }}>
            {formatValue(stressedMetrics.stressedVolatility)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base Volatility: {formatValue(volatility)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid rgba(226, 232, 240, 0.9)",
            backgroundColor: "rgba(248, 250, 252, 0.9)",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Stressed Drawdown
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: "#7c2d12", fontWeight: 700 }}>
            {formatValue(stressedMetrics.stressedDrawdown)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base Drawdown: {formatValue(Math.abs(maxDrawdown))}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}