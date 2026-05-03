import { MetricCard, SkeletonBlock, SkeletonCard } from "@/shared/components";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeToSpend } from "../hooks/useSafeToSpend";

const PERIODS = ["Weekly", "Monthly", "Yearly"] as const;
type Period = (typeof PERIODS)[number];

export const SafeToSpendCard = () => {
  const { data, loading } = useSafeToSpend();
  const [period, setPeriod] = useState<Period>("Monthly");

  if (loading || !data)
    return (
      <SkeletonCard>
        <SkeletonBlock height={12} width="50%" />
        <SkeletonBlock height={40} width="65%" />
        <SkeletonBlock height={52} />
      </SkeletonCard>
    );

  const nextPeriod = () => {
    const idx = PERIODS.indexOf(period);
    setPeriod(PERIODS[(idx + 1) % PERIODS.length]);
  };

  return (
    <MetricCard
      label="Safe-to-Spend"
      amount={`₹${data.amount.toLocaleString()}`}
      rightPill={{ label: period, onPress: nextPeriod }}
    >
      <TouchableOpacity style={styles.dailyRow} activeOpacity={0.8}>
        <View>
          <Text style={styles.dailyLabel}>Daily Limit</Text>
          <Text style={styles.dailyValue}>
            ₹{data.dailyLimit}/day remaining
          </Text>
        </View>
        <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    </MetricCard>
  );
};

const styles = StyleSheet.create({
  dailyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: 12,
  },
  dailyLabel: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  dailyValue: { fontSize: 14, fontFamily: "Inter-Bold", color: "#FFFFFF" },
});
