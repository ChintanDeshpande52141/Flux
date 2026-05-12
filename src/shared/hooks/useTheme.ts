import { useThemeContext } from "../context/ThemeContext";
import { Theme } from "../theme/lightTheme";

export const useTheme = (): Theme => {
  const { theme } = useThemeContext();
  return theme;
};
