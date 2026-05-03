import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/shared/theme";
import { Transaction } from "../services/transactionsService";

const CATEGORY_COLORS: Record<string, string> = {
  Food:          "#F59E0B",
  Transport:     "#6366F1",
  Shopping:      "#EC4899",
  Entertainment: "#10B981",
  Others:        "#9CA3AF",
};

const PAYMENT_COLORS: Record<string, string> = {
  UPI:    "#00BAE5",
  Cash:   "#10B981",
  Credit: "#F59E0B",
  Debit:  "#6366F1",
};

const CATEGORY_INITIALS: Record<string, string> = {
  Food:          "🍽",
  Transport:     "🚗",
  Shopping:      "🛍",
  Entertainment: "🎬",
  Others:        "📦",
};

type Props = {
  item: Transaction;
};

export const TransactionItem = ({ item }: Props) => {
  const theme = useTheme();
  const catColor = CATEGORY_COLORS[item.category] ?? "#9CA3AF";
  const payColor = PAYMENT_COLORS[item.paymentType] ?? "#9CA3AF";

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: `${catColor}20` }]}>
        <Text style={styles.emoji}>{CATEGORY_INITIALS[item.category]}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={[styles.merchant, { color: theme.text }]} numberOfLines={1}>
          {item.merchant}
        </Text>
        <Text style={[styles.date, { color: theme.subtext }]}>{item.date}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: theme.text }]}>
          -₹{item.amount.toLocaleString()}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: `${payColor}20` }]}>
          <Text style={[styles.typeText, { color: payColor }]}>
            {item.paymentType}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 18 },
  middle: { flex: 1 },
  merchant: { fontSize: 14, fontFamily: "Inter-Bold", marginBottom: 2 },
  date: { fontSize: 11, fontFamily: "Inter-Regular" },
  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 14, fontFamily: "Inter-Bold" },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: { fontSize: 10, fontFamily: "Inter-Bold" },
});
