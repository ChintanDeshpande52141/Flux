import { useTheme } from "@/shared/theme";
import { AmountInput } from "./AmountInput";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  savingsGoal: string;
  setSavingsGoal: (v: string) => void;
  totalIncome: number;
  mode?: "onboarding" | "settings";
};

export const Step4Savings = ({
  savingsGoal,
  setSavingsGoal,
  totalIncome,
  mode = "onboarding",
}: Props) => {
  const theme = useTheme();
  const goal = Number(savingsGoal) || 0;
  const available = totalIncome - goal;
  const QUICK = [5000, 10000, 20000];

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Set your savings goal
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        How much do you want to save each month? We'll deduct this from your
        safe-to-spend amount.
      </Text>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Monthly Savings Target
        </Text>
        <AmountInput
          value={savingsGoal}
          onChangeText={setSavingsGoal}
          placeholder="0"
        />
        <View style={styles.quickRow}>
          {QUICK.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.quickChip,
                {
                  borderColor: goal === q ? theme.veloBlue : theme.border,
                  backgroundColor:
                    goal === q ? theme.veloBlueDim : theme.surfaceVariant,
                },
              ]}
              onPress={() => setSavingsGoal(String(q))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickChipText,
                  { color: goal === q ? theme.veloBlue : theme.subtext },
                ]}
              >
                ₹{(q / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {totalIncome > 0 && (
        <View
          style={[styles.previewBox, { backgroundColor: theme.veloBlueDim }]}
        >
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabel, { color: theme.subtext }]}>
              Income
            </Text>
            <Text style={[styles.previewValue, { color: theme.text }]}>
              ₹{totalIncome.toLocaleString()}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabel, { color: theme.subtext }]}>
              Savings Goal
            </Text>
            <Text style={[styles.previewValue, { color: theme.danger }]}>
              {goal > 0 ? `−₹${goal.toLocaleString()}` : "₹0"}
            </Text>
          </View>
          <View
            style={[styles.previewDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabelBold, { color: theme.text }]}>
              Estimated Available for Spending
            </Text>
            <Text style={[styles.previewAmountBold, { color: theme.veloBlue }]}>
              ₹{available.toLocaleString()}
            </Text>
          </View>
          <Text style={[styles.previewEstimateNote, { color: theme.subtext }]}>
            Estimate only — excludes fixed bills and subscriptions. Your
            actual safe-to-spend amount is calculated after onboarding.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stepContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  sourceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  cardFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  quickRow: { flexDirection: "row", gap: 8 },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipText: { fontSize: 13, fontFamily: "Inter-Bold" },
  previewBox: { borderRadius: 14, padding: 16, gap: 10, marginTop: 4 },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 13, fontFamily: "Inter-Regular" },
  previewValue: { fontSize: 14, fontFamily: "Inter-Bold" },
  previewLabelBold: { fontSize: 14, fontFamily: "Inter-Bold" },
  previewAmountBold: { fontSize: 22, fontFamily: "Inter-Black" },
  previewEstimateNote: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    lineHeight: 15,
  },
  previewDivider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
});
