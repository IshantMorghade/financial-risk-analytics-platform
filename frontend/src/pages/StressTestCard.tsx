import { useMemo, useState } from "react";
import { Card, Typography, Box, Slider, Grid } from "@mui/material";

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
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Interactive Stress Test
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Simulate adverse market shocks and observe how key risk measures change.
      </Typography>

      <Box sx={{ px: 1, mb: 3 }}>
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Stressed VaR
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#dc2626" }}>
              {formatValue(stressedMetrics.stressedVar)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Base VaR: {formatValue(baseVar)}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Stressed Volatility
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#f59e0b" }}>
              {formatValue(stressedMetrics.stressedVolatility)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Base Volatility: {formatValue(volatility)}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Stressed Drawdown
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#7c2d12" }}>
              {formatValue(stressedMetrics.stressedDrawdown)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Base Drawdown: {formatValue(Math.abs(maxDrawdown))}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}