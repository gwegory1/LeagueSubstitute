import { createTheme } from "@mui/material/styles";

// Dark Blue and Pink Color Palette - Modern Aesthetic
const colors = {
  // Core console colors
  black: "#000000",
  darkGray: "#0f0f0f",
  mediumGray: "#2a2a2a",
  lightGray: "#606060",
  white: "#f0f0f0",

  // Dark blue and pink theme colors
  blue: "#4a90ff", // Bright electric blue
  pink: "#ff6b9d", // Vibrant pink
  cyan: "#00e6e6", // Keep cyan for accents
  red: "#e60000", // Keep red for errors
  yellow: "#e6e600", // Keep yellow for warnings

  // Background colors
  consoleBlack: "#050505",
  consoleDark: "#0f0f0f",

  // Muted versions for UI
  blueMuted: "#3366cc",
  pinkMuted: "#cc5577",
  cyanMuted: "#00b3b3",
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.blue,
      light: colors.blueMuted,
      dark: "#2266aa",
      contrastText: colors.white,
    },
    secondary: {
      main: colors.pink,
      light: colors.pinkMuted,
      dark: "#aa4466",
      contrastText: colors.white,
    },
    success: {
      main: colors.blue,
      light: colors.blueMuted,
      dark: "#2266aa",
    },
    warning: {
      main: colors.pink,
      light: colors.pinkMuted,
      dark: "#aa4466",
    },
    error: {
      main: colors.red,
      light: "#ff3333",
      dark: "#cc0000",
    },
    info: {
      main: colors.cyan,
      light: colors.cyanMuted,
      dark: "#0099aa",
    },
    background: {
      default: colors.consoleBlack,
      paper: colors.consoleDark,
    },
    text: {
      primary: colors.blue,
      secondary: colors.pink,
    },
    divider: colors.mediumGray,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: colors.blue,
      letterSpacing: "0.02em",
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: colors.blue,
      letterSpacing: "0.015em",
      marginBottom: "0.875rem",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: colors.cyan,
      letterSpacing: "0.01em",
      marginBottom: "0.75rem",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: colors.cyan,
      letterSpacing: "0.005em",
      marginBottom: "0.625rem",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: colors.cyan,
      letterSpacing: "0.002em",
      marginBottom: "0.5rem",
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      color: colors.cyan,
      letterSpacing: "0em",
      marginBottom: "0.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: colors.white,
      letterSpacing: "0.01em",
      marginBottom: "0.75rem",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: colors.lightGray,
      letterSpacing: "0.008em",
      marginBottom: "0.625rem",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: colors.pink,
      letterSpacing: "0.05em",
      marginBottom: "0.5rem",
    },
  },
  shape: {
    borderRadius: 6, // Increased corner rounding
  },
  spacing: 8, // Standard spacing
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.blue} ${colors.darkGray}`,
        },
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: colors.darkGray,
        },
        "*::-webkit-scrollbar-thumb": {
          background: colors.blue,
          borderRadius: "2px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          background: colors.blueMuted,
        },
        body: {
          background: colors.consoleBlack,
          minHeight: "100vh",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.consoleDark} 0%, ${colors.darkGray} 100%)`,
          borderBottom: `3px solid ${colors.blue}`,
          boxShadow: `0 4px 20px rgba(74, 144, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3)`,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent 0%, ${colors.cyan} 20%, ${colors.blue} 50%, ${colors.pink} 80%, transparent 100%)`,
            opacity: 0.6,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `rgba(15, 15, 15, 0.6)`,
          border: `1px solid rgba(74, 144, 255, 0.2)`,
          borderRadius: 8,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3)`,
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: `rgba(15, 15, 15, 0.5)`,
          border: `1px solid rgba(74, 144, 255, 0.15)`,
          borderRadius: 6,
          boxShadow: `0 1px 6px rgba(0, 0, 0, 0.2)`,
          backdropFilter: "blur(6px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`,
            transition: "left 0.5s ease",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueMuted} 100%)`,
          color: colors.white,
          border: `2px solid ${colors.blue}`,
          boxShadow: `0 4px 15px rgba(74, 144, 255, 0.3)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.blueMuted} 0%, ${colors.blue} 100%)`,
            borderColor: colors.blueMuted,
            boxShadow: `0 6px 20px rgba(74, 144, 255, 0.4)`,
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          border: `2px solid ${colors.blue}`,
          color: colors.blue,
          background: `rgba(74, 144, 255, 0.05)`,
          "&:hover": {
            background: colors.blue,
            color: colors.white,
            boxShadow: `0 4px 15px rgba(74, 144, 255, 0.3)`,
            transform: "translateY(-1px)",
          },
        },
        text: {
          color: colors.cyan,
          "&:hover": {
            background: `rgba(0, 255, 255, 0.1)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            background: `rgba(0, 255, 0, 0.02)`,
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: `rgba(74, 144, 255, 0.3)`,
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: colors.cyan,
              boxShadow: `0 0 8px rgba(0, 255, 255, 0.2)`,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.blue,
              boxShadow: `0 0 12px rgba(74, 144, 255, 0.3)`,
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.lightGray,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            "&.Mui-focused": {
              color: colors.blue,
            },
          },
          "& .MuiInputBase-input": {
            color: colors.white,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.02em",
        },
        filled: {
          background: `rgba(74, 144, 255, 0.8)`,
          color: colors.white,
          boxShadow: `0 1px 4px rgba(74, 144, 255, 0.2)`,
        },
        outlined: {
          border: `2px solid ${colors.blue}`,
          color: colors.blue,
          background: `rgba(74, 144, 255, 0.05)`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          border: "2px solid",
          backdropFilter: "blur(8px)",
        },
        standardSuccess: {
          background: colors.darkGray,
          color: colors.blue,
          borderColor: colors.blue,
        },
        standardWarning: {
          background: colors.darkGray,
          color: colors.pink,
          borderColor: colors.pink,
        },
        standardError: {
          background: colors.darkGray,
          color: colors.red,
          borderColor: colors.red,
        },
        standardInfo: {
          background: colors.darkGray,
          color: colors.cyan,
          borderColor: colors.cyan,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          background: colors.darkGray,
        },
        bar: {
          borderRadius: 4,
          background: colors.blue,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.blue,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: `rgba(74, 144, 255, 0.25)`,
          borderWidth: "1px",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            background: colors.darkGray,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.mediumGray}`,
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: colors.white,
        },
        head: {
          background: colors.darkGray,
          color: colors.blue,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        },
      },
    },
  },
});
