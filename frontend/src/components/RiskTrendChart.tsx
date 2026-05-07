import { Card, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { date: string; rollingVolatility: number }[];
};

export default function RiskTrendChart({ data }: Props) {
  const hasData = data && data.length > 0;

  return (
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
          Rolling Volatility
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Tracks short-term changes in portfolio volatility over time.
        </Typography>
      </Box>

      {!hasData ? (
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
          No rolling volatility data available.
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="78%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
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
              formatter={(value) => [Number(value).toFixed(4), "Rolling Volatility"]}
            />
            <Line
              type="monotone"
              dataKey="rollingVolatility"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}