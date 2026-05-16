import { Plus, Trash2 } from "lucide-react-native";
import { useTheme } from "@/shared/theme";
import { AmountInput } from "./AmountInput";
import type { IncomeSource } from "@/shared/context/OnboardingContext";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  sources: IncomeSource[];
  setSources: (s: IncomeSource[]) => void;
  mode?: "onboarding" | "settings";
};

export const Step2Income = ({
  sources,
  setSources,
  mode = "onboarding",
}: Props) => {
  const theme = useTheme();
  const total = sources.reduce((s, x) => s + (Number(x.amount) || 0), 0);

  const update = (i: number, field: keyof IncomeSource, val: string) => {
    const next = [...sources];
    if (field === "amount") next[i] = { ...next[i], amount: Number(val) || 0 };
    else next[i] = { ...next[i], name: val };
    setSources(next);
  };

  const add = () => setSources([...sources, { name: "", amount: 0 }]);
  const remove = (i: number) => setSources(sources.filter((_, idx) => idx !== i));

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        What's your monthly income?
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Add all your income sources. We'll calculate your safe-to-spend amount
        based on this.
      </Text>

      {sources.map((src, i) => (
        <View
          key={i}
          style={[
            styles.sourceCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.sourceHeader}>
            <Text style={[styles.sourceIndex, { color: theme.subtext }]}>
              Income Source {i + 1}
            </Text>
            {sources.length > 1 && (
              <TouchableOpacity onPress={() => remove(i)} hitSlop={8}>
                <Trash2 size={16} color={theme.danger} />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[
              styles.nameInput,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            value={src.name}
            onChangeText={(v) => update(i, "name", v)}
            placeholder={i === 0 ? "Primary Salary" : "e.g., Freelance, Rental"}
            placeholderTextColor={theme.subtextLight}
          />
          <AmountInput
            value={src.amount ? String(src.amount) : ""}
            onChangeText={(v) => update(i, "amount", v)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addBtn, { borderColor: theme.border }]}
        onPress={add}
        activeOpacity={0.7}
      >
        <Plus size={16} color={theme.veloBlue} />
        <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>
          Add Another Income Source
        </Text>
      </TouchableOpacity>

      {total > 0 && (
        <View style={[styles.totalBox, { backgroundColor: theme.veloBlueDim }]}>
          <Text style={[styles.totalBoxLabel, { color: theme.subtext }]}>
            Total Monthly Income
          </Text>
          <Text style={[styles.totalBoxAmount, { color: theme.text }]}>
            ₹{total.toLocaleString()}
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
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceIndex: { fontSize: 12, fontFamily: "Inter-Bold", letterSpacing: 0.3 },
  nameInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addBtnText: { fontSize: 14, fontFamily: "Inter-Bold" },
  totalBox: { borderRadius: 14, padding: 16, gap: 4 },
  totalBoxLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  totalBoxAmount: { fontSize: 28, fontFamily: "Inter-Black" },
});
