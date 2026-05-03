import {
  Card,
  FluxLineChart,
  NavButton,
  SkeletonBlock,
  SkeletonCard,
} from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSpendingPulse } from "../hooks/useSpendingPulse";

const CHART_WIDTH = Dimensions.get("window").width - 64;

export const SpendingPulseCard = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data, loading } = useSpendingPulse();

  if (loading || !data)
    return (
      <SkeletonCard>
        <SkeletonBlock height={14} width="55%" />
        <SkeletonBlock height={120} />
        <SkeletonBlock height={12} width="40%" />
      </SkeletonCard>
    );

  const chartData = data.entries.map((e) => ({
    value: e.value,
    label: e.label,
    dataPointText: "",
  }));

  return (
    <Card padding={20}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Spending Analysis
        </Text>
        <NavButton onPress={() => router.push("/spending-analysis")} />
      </View>

      <FluxLineChart data={chartData} height={120} />

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.dotRow}>
          <View style={[styles.dot, { backgroundColor: theme.veloBlue }]} />
          <Text style={[styles.footerLabel, { color: theme.subtext }]}>
            This Week's Spending
          </Text>
        </View>
        <Text style={[styles.footerValue, { color: theme.text }]}>
          ₹{data.total.toLocaleString()}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 16, fontFamily: "Inter-Bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dotRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footerLabel: { fontSize: 13, fontFamily: "Inter-Regular" },
  footerValue: { fontSize: 15, fontFamily: "Inter-Bold" },
});
