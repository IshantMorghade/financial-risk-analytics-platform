import { alpha, createTheme } from "@mui/material/styles";

const PRIMARY = "#3b82f6";
const INFO = "#06b6d4";
const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const ERROR = "#ef4444";

const BG_DEFAULT = "#0b1020";
const BG_SURFACE = "#121a2b";
const BG_ELEVATED = "#182235";
const BG_SOFT = "#1f2a3d";

const BORDER = "rgba(148, 163, 184, 0.16)";
const TEXT_PRIMARY = "#e5e7eb";
const TEXT_SECONDARY = "#94a3b8";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      layout: {
        sidebarWidth: number;
        topbarHeight: number;
        pageX: number;
        pageY: number;
        sectionGap: number;
        cardRadius: number;
        cardPadding: number;
        widgetMinHeight: number;
      };
      palette: {
        surface: string;
        elevated: string;
        soft: string;
        border: string;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      layout?: {
        sidebarWidth?: number;
        topbarHeight?: number;
        pageX?: number;
        pageY?: number;
        sectionGap?: number;
        cardRadius?: number;
        cardPadding?: number;
        widgetMinHeight?: number;
      };
      palette?: {
        surface?: string;
        elevated?: string;
        soft?: string;
        border?: string;
      };
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: PRIMARY },
    info: { main: INFO },
    success: { main: SUCCESS },
    warning: { main: WARNING },
    error: { main: ERROR },
    background: {
      default: BG_DEFAULT,
      paper: BG_SURFACE,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: BORDER,
  },

  custom: {
    layout: {
      sidebarWidth: 260,
      topbarHeight: 72,
      pageX: 24,
      pageY: 24,
      sectionGap: 24,
      cardRadius: 16,
      cardPadding: 20,
      widgetMinHeight: 320,
    },
    palette: {
      surface: BG_SURFACE,
      elevated: BG_ELEVATED,
      soft: BG_SOFT,
      border: BORDER,
    },
  },

  shape: {
    borderRadius: 16,
  },

  spacing: 4,

  typography: {
    fontFamily: `'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif`,
    h1: {
      fontSize: "2rem",
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: 1.3,
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.125rem",
      lineHeight: 1.35,
      fontWeight: 700,
    },
    h5: {
      fontSize: "1rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    h6: {
      fontSize: "0.95rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "0.95rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: TEXT_SECONDARY,
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
      color: TEXT_SECONDARY,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      color: TEXT_SECONDARY,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG_DEFAULT,
          color: TEXT_PRIMARY,
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
        },
        "#root": {
          minHeight: "100vh",
        },
        "*::-webkit-scrollbar": {
          width: 10,
          height: 10,
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(148,163,184,0.22)",
          borderRadius: 999,
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: "blur(12px)",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: BG_SURFACE,
          borderRight: `1px solid ${BORDER}`,
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: BG_SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(2, 6, 23, 0.24)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
          minHeight: 40,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#2563eb",
          },
        },
        outlined: {
          borderColor: BORDER,
          "&:hover": {
            borderColor: alpha(PRIMARY, 0.5),
            backgroundColor: alpha(PRIMARY, 0.08),
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 180ms ease",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: BORDER,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#fff", 0.02),
          borderRadius: 12,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: BORDER,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(PRIMARY, 0.45),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY,
            borderWidth: 1,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${BORDER}`,
        },
        head: {
          color: TEXT_SECONDARY,
          fontWeight: 600,
          backgroundColor: alpha("#fff", 0.02),
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: BG_ELEVATED,
          border: `1px solid ${BORDER}`,
          color: TEXT_PRIMARY,
          fontSize: 12,
        },
      },
    },
  },
});

export default theme;