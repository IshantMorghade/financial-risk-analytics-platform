import { Card, Typography, Box, Tooltip } from "@mui/material";

type Props = {
  data: any[];
};

function getNumericColumns(rows: any[]) {
  if (!rows?.length) return [];

  const sample = rows[0];
  return Object.keys(sample).filter((key) =>
    rows.every((row) => {
      const value = row?.[key];
      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !isNaN(Number(value))
      );
    })
  );
}

function computeCorrelationMatrix(rows: any[], columns: string[]) {
  const values = columns.map((col) => rows.map((row) => Number(row[col] ?? 0)));

  const mean = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  const correlation = (x: number[], y: number[]) => {
    const mx = mean(x);
    const my = mean(y);

    let numerator = 0;
    let dx = 0;
    let dy = 0;

    for (let i = 0; i < x.length; i++) {
      const a = x[i] - mx;
      const b = y[i] - my;
      numerator += a * b;
      dx += a * a;
      dy += b * b;
    }

    const denominator = Math.sqrt(dx * dy);
    if (!denominator) return 0;
    return numerator / denominator;
  };

  return values.map((_, i) =>
    values.map((__, j) => correlation(values[i], values[j]))
  );
}

function getCellColor(value: number) {
  if (value >= 0.75) return "#166534";
  if (value >= 0.4) return "#22c55e";
  if (value >= 0.1) return "#86efac";
  if (value > -0.1) return "#e5e7eb";
  if (value > -0.4) return "#fca5a5";
  if (value > -0.75) return "#ef4444";
  return "#991b1b";
}

function getTextColor(value: number) {
  return Math.abs(value) >= 0.4 ? "#ffffff" : "#111827";
}

const legendItems = [
  { label: "Strong Negative", color: "#991b1b" },
  { label: "Moderate Negative", color: "#ef4444" },
  { label: "Weak Negative", color: "#fca5a5" },
  { label: "Neutral", color: "#e5e7eb" },
  { label: "Weak Positive", color: "#86efac" },
  { label: "Moderate Positive", color: "#22c55e" },
  { label: "Strong Positive", color: "#166534" },
];

export default function CorrelationHeatmap({ data }: Props) {
  const numericColumns = getNumericColumns(data).slice(0, 6);
  const matrix =
    numericColumns.length >= 2
      ? computeCorrelationMatrix(data, numericColumns)
      : [];

  return (
    <Card
      sx={{
        p: 2.5,
        minHeight: 420,
        borderRadius: 3,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#0f172a" }}>
        Correlation Heatmap
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Shows relationships between numeric variables in the selected dataset.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
          alignItems: "center",
        }}
      >
        {legendItems.map((item) => (
          <Box
            key={item.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "3px",
                backgroundColor: item.color,
                border: "1px solid #d1d5db",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {numericColumns.length < 2 ? (
        <Typography color="text.secondary">
          Not enough numeric columns available to generate a heatmap.
        </Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `120px repeat(${numericColumns.length}, 72px)`,
              gap: 1,
              alignItems: "center",
              minWidth: "max-content",
            }}
          >
            <Box />
            {numericColumns.map((col) => (
              <Box
                key={`header-${col}`}
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                {col}
              </Box>
            ))}

            {numericColumns.map((rowCol, rowIndex) => (
              <Box key={`row-group-${rowCol}`} sx={{ display: "contents" }}>
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: "text.secondary",
                    pr: 1,
                  }}
                >
                  {rowCol}
                </Box>

                {numericColumns.map((col, colIndex) => {
                  const value = matrix[rowIndex][colIndex];

                  return (
                    <Tooltip
                      key={`${rowCol}-${col}`}
                      title={`${rowCol} vs ${col}: ${value.toFixed(2)}`}
                      arrow
                    >
                      <Box
                        sx={{
                          width: 72,
                          height: 56,
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: getCellColor(value),
                          color: getTextColor(value),
                          fontWeight: 700,
                          fontSize: 13,
                          boxShadow: 1,
                        }}
                      >
                        {value.toFixed(2)}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
}