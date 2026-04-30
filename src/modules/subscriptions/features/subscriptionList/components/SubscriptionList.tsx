import { SectionHeader } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSubscriptionList } from "../hooks/useSubscriptionList";
import { Subscription, SubscriptionBadge } from "../types";

const BADGE_COLORS: Record<SubscriptionBadge, string> = {
  Auto: "#00BAE5",
  Fixed: "#6366F1",
  Elite: "#F59E0B",
  Manual: "#9CA3AF",
};

const BillItem = ({ item }: { item: Subscription }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: theme.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.logo, { backgroundColor: `${item.logoColor}20` }]}>
        <Text style={[styles.logoText, { color: item.logoColor }]}>
          {item.logoInitial}
        </Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemSub, { color: theme.subtext }]}>
          {item.subtitle}
        </Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemAmount, { color: theme.text }]}>
          ₹{item.amount.toLocaleString()}
        </Text>
        <View style={styles.badgeRow}>
          {item.badge && (
            <View
              style={[
                styles.badge,
                { backgroundColor: `${BADGE_COLORS[item.badge]}20` },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: BADGE_COLORS[item.badge] }]}
              >
                {item.badge}
              </Text>
            </View>
          )}
          <Text style={[styles.cycle, { color: theme.subtextLight }]}>
            / mo
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SubscriptionList = () => {
  const theme = useTheme();
  const { data, loading } = useSubscriptionList();

  if (loading || !data) return null;

  return (
    <View>
      {data.categories.map((cat) => (
        <View key={cat.label} style={styles.categoryBlock}>
          <TouchableOpacity
            style={[styles.categoryRow, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
          >
            <SectionHeader label={cat.label} />
          </TouchableOpacity>
          {cat.items.map((item) => (
            <BillItem key={item.id} item={item} />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.addCta} activeOpacity={0.7}>
        <View style={[styles.addCircle, { borderColor: theme.border }]}>
          <Plus size={20} color={theme.subtextLight} />
        </View>
        <Text style={[styles.addText, { color: theme.subtext }]}>
          Missing an obligation?
        </Text>
        <Text style={[styles.addSub, { color: theme.subtextLight }]}>
          Add a recurring subscription or rent.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBlock: { marginBottom: 8 },
  categoryRow: { paddingVertical: 4 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 16, fontFamily: "Inter-Bold" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontFamily: "Inter-Bold", marginBottom: 2 },
  itemSub: { fontSize: 12, fontFamily: "Inter-Regular" },
  itemRight: { alignItems: "flex-end", gap: 4 },
  itemAmount: { fontSize: 14, fontFamily: "Inter-Bold" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontFamily: "Inter-Bold" },
  cycle: { fontSize: 11, fontFamily: "Inter-Regular" },
  addCta: { alignItems: "center", paddingVertical: 32, gap: 8 },
  addCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { fontSize: 14, fontFamily: "Inter-Bold" },
  addSub: { fontSize: 12, fontFamily: "Inter-Regular" },
});
