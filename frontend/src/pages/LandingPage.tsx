import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";
import {
  ShowChart,
  UploadFile,
  Insights,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const handleScrollToHero = () => {
    const section = document.getElementById("hero-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToFeatures = () => {
    const section = document.getElementById("features-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToAbout = () => {
    const section = document.getElementById("about-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      title: "Portfolio Analytics",
      description: "VaR, volatility, Sharpe ratio, and portfolio risk metrics.",
      icon: <ShowChart sx={{ fontSize: 34, color: "#38bdf8" }} />,
    },
    {
      title: "CSV Upload",
      description: "Upload financial datasets and start analysis in seconds.",
      icon: <UploadFile sx={{ fontSize: 34, color: "#38bdf8" }} />,
    },
    {
      title: "Interactive Charts",
      description: "Visualize trends, volatility, and drawdowns clearly.",
      icon: <Insights sx={{ fontSize: 34, color: "#38bdf8" }} />,
    },
    {
      title: "Admin Dashboard",
      description: "Manage users and uploaded datasets efficiently.",
      icon: <AdminPanelSettings sx={{ fontSize: 34, color: "#38bdf8" }} />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #06132a 0%, #081a3a 100%)",
        color: "#fff",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(7, 18, 43, 0.86)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
              FinRisk Insight
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
            >
              <Button color="inherit" onClick={handleScrollToHero}>
                Home
              </Button>
              <Button color="inherit" onClick={handleScrollToFeatures}>
                Features
              </Button>
              <Button color="inherit" onClick={handleScrollToAbout}>
                About
              </Button>
            </Stack>

            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "#1d9bf0",
                "&:hover": { backgroundColor: "#1683ca" },
              }}
            >
              Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        <Box
          id="hero-section"
          sx={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: { xs: 8, md: 10 },
          }}
        >
          <Box sx={{ maxWidth: 850 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#7dd3fc",
                fontWeight: 700,
                letterSpacing: 1.4,
              }}
            >
              Finance Risk Analytics Platform
            </Typography>

            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 2,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2.2rem", md: "3.8rem" },
              }}
            >
              Enterprise Financial Risk Analytics Platform
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontWeight: 400,
                lineHeight: 1.8,
                maxWidth: 760,
                mx: "auto",
                mb: 4,
              }}
            >
              Analyze portfolio volatility, Value at Risk (VaR), drawdowns,
              and market trends using interactive dashboards.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  px: 3,
                  py: 1.4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  backgroundColor: "#1d9bf0",
                  boxShadow: "0 10px 30px rgba(29, 155, 240, 0.28)",
                  "&:hover": {
                    backgroundColor: "#1683ca",
                  },
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                onClick={handleScrollToFeatures}
                sx={{
                  px: 3,
                  py: 1.4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.28)",
                }}
              >
                Learn More
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="text"
                sx={{
                  px: 2,
                  py: 1.4,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#7dd3fc",
                }}
              >
                Register
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box id="features-section" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 800, mb: 1.5 }}
          >
            Platform Features
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "rgba(255,255,255,0.72)",
              maxWidth: 760,
              mx: "auto",
              mb: 5,
            }}
          >
            Everything needed for financial analytics, academic demos, and risk-focused dashboards.
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(15, 23, 42, 0.72)",
                    border: "1px solid rgba(148, 163, 184, 0.16)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
                    color: "#fff",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          id="about-section"
          sx={{
            py: { xs: 6, md: 8 },
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            About the Project
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 820,
              mx: "auto",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
            }}
          >
            FinRisk Insight is a B.Tech final year project focused on portfolio
            risk measurement, Value at Risk analysis, volatility tracking,
            drawdown monitoring, and market data visualization through an
            interactive analytics platform.
          </Typography>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid rgba(148, 163, 184, 0.15)",
          py: 3,
          textAlign: "center",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <Typography variant="body2">
          © 2026 FinRisk Insight | B.Tech Final Year Project
        </Typography>
      </Box>
    </Box>
  );
}