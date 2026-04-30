import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  icon: React.ReactNode;
  title: string;
  body: string;
  accentColor?: string;
};

export const InsightItem = ({ icon, title, body, accentColor }: Props) => {
  const theme = useTheme();
  const color = accentColor ?? theme.success;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${color}15`,
          borderLeftColor: color,
        },
      ]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.body, { color: theme.subtext }]}>{body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 10,
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrap: { marginTop: 1 },
  text: { flex: 1 },
  title: { fontSize: 13, fontFamily: "Inter-Bold", marginBottom: 2 },
  body: { fontSize: 12, fontFamily: "Inter-Regular", lineHeight: 18 },
});
