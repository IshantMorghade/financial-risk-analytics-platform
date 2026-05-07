import { Card, Typography, Box } from "@mui/material";

type Props = {
  baseVar?: number;
  stressedVar?: number;
};

function formatValue(value: number, digits = 4) {
  return Number(value ?? 0).toFixed(digits);
}

export default function ScenarioCard({ baseVar, stressedVar }: Props) {
  const hasData =
    typeof baseVar === "number" &&
    !Number.isNaN(baseVar) &&
    typeof stressedVar === "number" &&
    !Number.isNaN(stressedVar);

  let changeLabel = "";
  let changePercent: number | null = null;

  if (hasData && baseVar !== 0) {
    changePercent = ((Number(stressedVar) - Number(baseVar)) / Math.abs(Number(baseVar))) * 100;
    changeLabel =
      changePercent >= 0
        ? "Increase in stressed VaR"
        : "Decrease in stressed VaR";
  }

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        minHeight: 160,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
        Scenario Impact
      </Typography>

      {!hasData ? (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Scenario impact will appear here once VaR and stressed VaR are available.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Run analytics on a dataset to populate scenario analysis.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Base VaR (95%): <strong>{formatValue(baseVar!)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stressed VaR (95%): <strong>{formatValue(stressedVar!)}</strong>
          </Typography>

          {changePercent !== null && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 600,
                color: changePercent >= 0 ? "#dc2626" : "#16a34a",
              }}
            >
              {changeLabel}: {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}