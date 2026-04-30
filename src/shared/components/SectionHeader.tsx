import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  label: string;
  onPress?: () => void;
  actionLabel?: string;
};

export const SectionHeader = ({ label, onPress, actionLabel }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.subtextLight }]}>{label}</Text>
      {actionLabel && (
        <Text
          style={[styles.action, { color: theme.veloBlue }]}
          onPress={onPress}
        >
          {actionLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  action: { fontSize: 13, fontFamily: "Inter-Regular" },
});
