import {
  Card,
  ProgressBar,
  SkeletonBlock,
  SkeletonCard,
} from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { Zap } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSpendingVelocity } from "../hooks/useSpendingVelocity";

export const SpendingVelocityCard = () => {
  const theme = useTheme();
  const { data, loading } = useSpendingVelocity();

  if (loading || !data)
    return (
      <SkeletonCard>
        <SkeletonBlock height={14} width="55%" />
        <SkeletonBlock height={10} width="70%" />
        <SkeletonBlock height={8} />
        <SkeletonBlock height={56} />
      </SkeletonCard>
    );

  const velocityColor =
    data.rate > 80
      ? theme.danger
      : data.rate > 60
        ? theme.warning
        : theme.veloBlue;

  return (
    <Card padding={20}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Spending Velocity
        </Text>
        <Text style={[styles.percent, { color: velocityColor }]}>
          {data.rate}%
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        You are {data.rate}% through your budget
      </Text>

      <View style={styles.barWrap}>
        <ProgressBar
          progress={data.rate / 100}
          color={velocityColor}
          height={8}
        />
        <View style={[styles.targetMarker, { left: `${data.target}%` as any }]}>
          <View
            style={[styles.markerLine, { backgroundColor: theme.subtext }]}
          />
        </View>
      </View>

      <View style={styles.scaleRow}>
        <Text style={[styles.scaleLabel, { color: theme.subtext }]}>0%</Text>
        <Text style={[styles.scaleLabel, { color: theme.subtext }]}>
          TARGET: {data.target}%
        </Text>
        <Text style={[styles.scaleLabel, { color: theme.subtext }]}>100%</Text>
      </View>

      <View style={[styles.tip, { backgroundColor: theme.surfaceVariant }]}>
        <View style={[styles.tipIcon, { backgroundColor: theme.text }]}>
          <Zap size={12} color={theme.surface} fill={theme.surface} />
        </View>
        <Text style={[styles.tipText, { color: theme.subtext }]}>
          {data.tip}
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
    marginBottom: 4,
  },
  title: { fontSize: 16, fontFamily: "Inter-Bold" },
  percent: { fontSize: 22, fontFamily: "Inter-Black" },
  subtitle: { fontSize: 13, fontFamily: "Inter-Regular", marginBottom: 14 },
  barWrap: { position: "relative", marginBottom: 6 },
  targetMarker: { position: "absolute", top: -4, alignItems: "center" },
  markerLine: { width: 1.5, height: 16, borderRadius: 1 },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  scaleLabel: { fontSize: 10, fontFamily: "Inter-Regular" },
  tip: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 12,
    alignItems: "flex-start",
    gap: 10,
  },
  tipIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    lineHeight: 18,
  },
});
