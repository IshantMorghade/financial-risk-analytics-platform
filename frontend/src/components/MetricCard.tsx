import { Card, Typography, Box } from "@mui/material";

type Tone = "default" | "success" | "warning" | "error" | "info";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: Tone;
};

const toneMap: Record<
  Tone,
  {
    accent: string;
    softLine: string;
  }
> = {
  default: {
    accent: "#94a3b8",
    softLine: "rgba(148, 163, 184, 0.45)",
  },
  success: {
    accent: "#22c55e",
    softLine: "rgba(34, 197, 94, 0.45)",
  },
  warning: {
    accent: "#f59e0b",
    softLine: "rgba(245, 158, 11, 0.45)",
  },
  error: {
    accent: "#ef4444",
    softLine: "rgba(239, 68, 68, 0.45)",
  },
  info: {
    accent: "#3b82f6",
    softLine: "rgba(59, 130, 246, 0.45)",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  tone = "default",
}: Props) {
  const theme = toneMap[tone];

  return (
    <Card
      sx={{
        p: 2.5,
        minHeight: 160,
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(17,24,39,0.96) 100%)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
        transition: "all 0.22s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "rgba(255,255,255,0.14)",
          boxShadow: "0 18px 34px rgba(0,0,0,0.34)",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#94a3b8",
          fontWeight: 600,
          letterSpacing: 0.2,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 1.2,
          fontSize: { xs: "2rem", sm: "2.2rem" },
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#f8fafc",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 1.6,
          color: "#94a3b8",
          lineHeight: 1.6,
          minHeight: 42,
        }}
      >
        {subtitle || "Key portfolio metric."}
      </Typography>

      <Box
        sx={{
          mt: 2,
          width: 52,
          height: 4,
          borderRadius: 999,
          backgroundColor: theme.accent,
          boxShadow: `0 0 14px ${theme.softLine}`,
        }}
      />
    </Card>
  );
}