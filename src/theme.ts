"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ff3b30", contrastText: "#fff" },
    secondary: { main: "#f5f2eb" },
    background: { default: "#070708", paper: "#121316" },
    text: { primary: "#f4f1ea", secondary: "#9c978e" },
    divider: "rgba(255,255,255,0.1)",
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "var(--font-manrope), sans-serif",
    h1: {
      fontFamily: "var(--font-unbounded), sans-serif",
      fontWeight: 500,
      letterSpacing: "-0.045em",
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: "var(--font-unbounded), sans-serif",
      fontWeight: 500,
      letterSpacing: "-0.04em",
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: "var(--font-manrope), sans-serif",
      fontWeight: 650,
      letterSpacing: "-0.02em",
    },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#070708",
          backgroundImage: "none",
          margin: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2, paddingInline: 20, minHeight: 44, letterSpacing: "0.02em" },
        outlined: { borderColor: "rgba(255,255,255,0.28)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 650 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.03)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});
