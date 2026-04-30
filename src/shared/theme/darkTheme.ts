import { brand } from "./tokens";
import { Theme } from "./lightTheme";

export const darkTheme: Theme = {
  ...brand,
  background: "#0D1117",
  surface: "#161B22",
  surfaceVariant: "#1C2333",
  text: "#F0F6FC",
  subtext: "#8B949E",
  subtextLight: "#6E7681",
  border: "#30363D",
  tabBar: "#161B22",
  tabBarBorder: "#30363D",
  inputBg: "#1C2333",
  shimmer: "#30363D",
  shadow: "#000000",
  overlay: "rgba(0,0,0,0.6)",
};
