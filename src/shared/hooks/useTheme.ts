import { useColorScheme } from "react-native";
import { darkTheme } from "../theme/darkTheme";
import { lightTheme, Theme } from "../theme/lightTheme";

export const useTheme = (): Theme => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
};
