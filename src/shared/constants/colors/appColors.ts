export type ThemeMode = "light" | "dark";

export const lightColors = {
  // Brand
  primary: "#FB5D3C",
  secondary: "#FFBFB1",
  accent: "#FFCEBD",

  // Backgrounds
  background: "#FFFFFF",
  surface: "#F5F7FA",
  card: "#F4F4F4",

  // Text
  textPrimary: "#000000",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Borders & separators
  border: "#E5E7EB",

  // States
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// constants/theme.ts
export const darkColors = {
  // Brand — same, intentional
  primary: "#FB5D3C",
  secondary: "#FFBFB1",
  accent: "#FFCEBD",

  // Backgrounds
  background: "#0F0F0F",
  surface: "#1C1C1E",
  card: "#2C2C2E",

  // Text
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",

  // Borders
  border: "#2C2C2E",

  // States — same
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};
