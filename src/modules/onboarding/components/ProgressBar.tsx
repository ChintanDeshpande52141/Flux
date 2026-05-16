import { useTheme } from "@/shared/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TOTAL_STEPS = 5;

type Props = {
  step: number;
};

export const ProgressBar = ({ step }: Props) => {
  const theme = useTheme();
  const pct = (step / TOTAL_STEPS) * 100;

  return (
    <View style={styles.progressWrap}>
      <Text style={[styles.stepLabel, { color: theme.subtext }]}>
        Step {step} of {TOTAL_STEPS}
      </Text>
      <Text style={[styles.pctLabel, { color: theme.veloBlue }]}>{pct}%</Text>
      <View style={[styles.track, { backgroundColor: theme.surfaceVariant }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.veloBlue,
              width: `${pct}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginBottom: 4,
  },
  pctLabel: {
    position: "absolute",
    right: 20,
    top: 12,
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  fill: {
    height: 4,
    borderRadius: 2,
  },
});
