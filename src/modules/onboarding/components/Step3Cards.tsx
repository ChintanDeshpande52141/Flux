import { Plus, Trash2 } from "lucide-react-native";
import { useTheme } from "@/shared/theme";
import { AmountInput } from "./AmountInput";
import type { CreditCard } from "@/shared/context/OnboardingContext";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  cards: CreditCard[];
  setCards: (c: CreditCard[]) => void;
  mode?: "onboarding" | "settings";
};

export const Step3Cards = ({ cards, setCards, mode = "onboarding" }: Props) => {
  const theme = useTheme();

  const update = (i: number, field: keyof CreditCard, val: string) => {
    const next = [...cards];
    const num = Number(val) || 0;
    if (field === "name") next[i] = { ...next[i], name: val };
    else if (field === "limit") {
      next[i] = { ...next[i], limit: num, spendCap: Math.round(num * 0.3) };
    } else {
      next[i] = { ...next[i], spendCap: num };
    }
    setCards(next);
  };

  const add = () => setCards([...cards, { name: "", limit: 0, spendCap: 0 }]);
  const remove = (i: number) => setCards(cards.filter((_, idx) => idx !== i));

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Add your credit cards
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Track credit limits and set spending caps. We'll alert you when you
        reach 30% of your limit.
      </Text>

      {cards.map((card, i) => (
        <View
          key={i}
          style={[
            styles.sourceCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.sourceHeader}>
            <Text style={[styles.sourceIndex, { color: theme.subtext }]}>
              Card {i + 1}
            </Text>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={8}>
              <Trash2 size={16} color={theme.danger} />
            </TouchableOpacity>
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
            value={card.name}
            onChangeText={(v) => update(i, "name", v)}
            placeholder="e.g., HDFC Regalia, Amex Platinum"
            placeholderTextColor={theme.subtextLight}
          />
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
                Credit Limit
              </Text>
              <AmountInput
                value={card.limit ? String(card.limit) : ""}
                onChangeText={(v) => update(i, "limit", v)}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
                Your Spend Cap
              </Text>
              <AmountInput
                value={card.spendCap ? String(card.spendCap) : ""}
                onChangeText={(v) => update(i, "spendCap", v)}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addBtn, { borderColor: theme.border }]}
        onPress={add}
        activeOpacity={0.7}
      >
        <Plus size={16} color={theme.veloBlue} />
        <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>
          Add Another Card
        </Text>
      </TouchableOpacity>

      <View style={[styles.tipBox, { backgroundColor: theme.warningDim }]}>
        <Text style={[styles.tipText, { color: theme.warning }]}>
          <Text style={styles.tipBold}>Pro Tip: </Text>
          We recommend keeping your spend cap at 30% of your credit limit to
          maintain a healthy credit score.
        </Text>
      </View>
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
  cardRow: { flexDirection: "row" },
  cardFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
    letterSpacing: 0.2,
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
  tipBox: { borderRadius: 12, padding: 14, marginTop: 4 },
  tipText: { fontSize: 13, fontFamily: "Inter-Regular", lineHeight: 18 },
  tipBold: { fontFamily: "Inter-Bold" },
});
