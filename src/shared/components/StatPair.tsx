import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/shared/theme";
import { Card } from "./Card";

type Stat = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type Props = {
  left: Stat;
  right: Stat;
};

const StatBox = ({ label, value, icon }: Stat) => {
  const theme = useTheme();
  return (
    <Card style={styles.statCard} padding={14}>
      {icon && <View style={styles.iconRow}>{icon}</View>}
      <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </Card>
  );
};

export const StatPair = ({ left, right }: Props) => (
  <View style={styles.row}>
    <View style={styles.cell}>
      <StatBox {...left} />
    </View>
    <View style={styles.cell}>
      <StatBox {...right} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 0 },
  cell: { flex: 1 },
  statCard: { marginBottom: 0 },
  iconRow: { marginBottom: 8 },
  label: { fontSize: 12, fontFamily: "Inter-Regular", marginBottom: 4 },
  value: { fontSize: 22, fontFamily: "Inter-Bold" },
});
