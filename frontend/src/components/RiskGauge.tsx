import { Card, Typography, Box, Chip, useTheme } from "@mui/material";
import ReactSpeedometer from "react-d3-speedometer";

type Props = {
  riskScore: number;
};

export default function RiskGauge({ riskScore }: Props) {
  const theme = useTheme();

  const label =
    riskScore >= 7 ? "HIGH RISK" : riskScore >= 4 ? "MODERATE RISK" : "SAFE";

  const color =
    riskScore >= 7
      ? theme.palette.error.main
      : riskScore >= 4
      ? theme.palette.warning.main
      : theme.palette.success.main;

  const helperText =
    riskScore >= 7
      ? "Risk level is elevated and may require immediate review."
      : riskScore >= 4
      ? "Risk level is moderate. Monitor trends and stress conditions."
      : "Risk level is within a safer operating range.";

  return (
    <Card
      sx={{
        p: 3,
        textAlign: "center",
        height: "100%",
        minHeight: 360,
        borderRadius: theme.custom.layout.cardRadius / 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Risk meter
        </Typography>

        <Chip
          label={label}
          size="small"
          sx={{
            fontWeight: 700,
            color: "#0b1020",
            backgroundColor: color,
            letterSpacing: 0.5,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <ReactSpeedometer
          minValue={0}
          maxValue={10}
          value={riskScore}
          segments={3}
          customSegmentStops={[0, 4, 7, 10]}
          segmentColors={[
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
          ]}
          needleColor={theme.palette.text.primary}
          textColor={theme.palette.text.primary}
          currentValueText={`Risk score: ${riskScore.toFixed(2)} / 10`}
          ringWidth={28}
          height={220}
          width={300}
        />
      </Box>

      <Typography
        sx={{
          mt: 1,
          fontSize: "1.25rem",
          fontWeight: 800,
          color,
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: "text.secondary",
          lineHeight: 1.6,
          maxWidth: 280,
          mx: "auto",
        }}
      >
        {helperText}
      </Typography>
    </Card>
  );
}