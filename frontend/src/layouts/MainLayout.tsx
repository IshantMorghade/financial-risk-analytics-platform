import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: "Compare", path: "/compare", icon: <CompareArrowsRoundedIcon fontSize="small" /> },
  { label: "Data Upload", path: "/data", icon: <CloudUploadRoundedIcon fontSize="small" /> },
  { label: "Admin", path: "/admin", icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
];

const MainLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = theme.custom.layout.sidebarWidth;
  const topbarHeight = theme.custom.layout.topbarHeight;

  const activeLabel = useMemo(() => {
    return navItems.find((item) => location.pathname.startsWith(item.path))?.label ?? "Workspace";
  }, [location.pathname]);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar
        sx={{
          minHeight: topbarHeight,
          px: 2.5,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            boxShadow: "0 10px 24px rgba(59,130,246,0.28)",
          }}
        >
          F
        </Box>

        <Box sx={{ ml: 1.5, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            FinRisk Insight
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Financial analytics platform
          </Typography>
        </Box>
      </Toolbar>

      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: 1 }}>
            Workspace
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600, mt: 0.5 }}>
            Risk command center
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Monitor VaR, volatility, drawdown, correlations, and scenario stress outcomes.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Navigation
        </Typography>

        <List sx={{ mt: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  mb: 0.75,
                  px: 1.5,
                  py: 1.2,
                  gap: 1.2,
                  color: active ? "text.primary" : "text.secondary",
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : "transparent",
                  border: `1px solid ${
                    active ? alpha(theme.palette.primary.main, 0.28) : "transparent"
                  }`,
                  "&:hover": {
                    bgcolor: active
                      ? alpha(theme.palette.primary.main, 0.18)
                      : alpha("#ffffff", 0.04),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: active ? "primary.main" : "text.secondary",
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : "transparent",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 700 : 600,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: alpha("#fff", 0.02),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            Analytics workspace
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Enterprise-grade financial risk monitoring for investor-ready reporting.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          bgcolor: alpha(theme.palette.background.default, 0.78),
        }}
      >
        <Toolbar
          sx={{
            minHeight: topbarHeight,
            px: { xs: 2, md: 3, xl: 4 },
            display: "flex",
            gap: 1.5,
          }}
        >
          {!isLgUp && (
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} edge="start">
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              {activeLabel}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Premium fintech analytics workspace
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<AssessmentRoundedIcon />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Export
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<LogoutRoundedIcon />}
            onClick={logout}
          >
            Logout
          </Button>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              color: "primary.light",
              fontWeight: 700,
            }}
          >
            F
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant={isLgUp ? "permanent" : "temporary"}
          open={isLgUp ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, md: 3, xl: 4 },
          py: { xs: 2, md: 3 },
          mt: `${topbarHeight}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;