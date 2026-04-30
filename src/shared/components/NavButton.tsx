import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react-native";
import { useTheme } from "@/shared/theme";

type Direction = "right" | "left" | "up" | "down";

type Props = {
  direction?: Direction;
  onPress?: () => void;
  size?: number;
};

const ICONS: Record<Direction, React.ElementType> = {
  right: ChevronRight,
  left: ChevronLeft,
  up: ChevronUp,
  down: ChevronDown,
};

export const NavButton = ({ direction = "right", onPress, size = 32 }: Props) => {
  const theme = useTheme();
  const Icon = ICONS[direction];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.surfaceVariant,
        },
      ]}
    >
      <Icon size={Math.round(size * 0.45)} color={theme.subtext} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { justifyContent: "center", alignItems: "center" },
});
