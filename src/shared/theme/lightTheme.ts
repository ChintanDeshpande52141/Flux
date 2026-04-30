import { brand } from "./tokens";

export const lightTheme = {
  ...brand,
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceVariant: "#F3F4F6",
  text: "#0D1117",
  subtext: "#6B7280",
  subtextLight: "#9CA3AF",
  border: "#E5E7EB",
  tabBar: "#FFFFFF",
  tabBarBorder: "#F3F4F6",
  inputBg: "#F3F4F6",
  shimmer: "#E5E7EB",
  shadow: "#000000",
  overlay: "rgba(0,0,0,0.4)",
};

export type Theme = typeof lightTheme;
