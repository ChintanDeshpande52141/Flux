import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  progress: number;
  color?: string;
  height?: number;
  backgroundColor?: string;
};

export const ProgressBar = ({ progress, color, height = 6, backgroundColor }: Props) => {
  const theme = useTheme();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: backgroundColor ?? theme.border,
          borderRadius: height / 2,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            height,
            backgroundColor: color ?? theme.veloBlue,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: {},
});
