import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "../constants";

export const useTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    colors,
  };
};
