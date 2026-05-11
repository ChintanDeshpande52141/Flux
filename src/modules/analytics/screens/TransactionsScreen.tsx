import { AppHeader } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddExpenseModal } from "../features/transactions/components/AddExpenseModal";
import { TransactionFilterSheet } from "../features/transactions/components/TransactionFilterSheet";
import {
  TransactionsList,
  TransactionStats,
} from "../features/transactions/components/TransactionsList";
import { TransactionFilters } from "../features/transactions/services/transactionsService";

const DEFAULT_FILTERS: TransactionFilters = {
  period: "This Week",
  paymentTypes: ["All"],
  categories: ["All"],
};

const activeFilterCount = (filters: TransactionFilters): number => {
  let count = 0;
  if (filters.period !== "This Week") count++;
  if (filters.paymentTypes[0] !== "All" || filters.paymentTypes.length > 1)
    count++;
  if (filters.categories[0] !== "All" || filters.categories.length > 1) count++;
  return count;
};

export const TransactionsScreen = () => {
  const theme = useTheme();
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [stats, setStats] = useState<TransactionStats>({ count: 0, total: 0 });

  const filterCount = activeFilterCount(filters);

  const rightElement = (
    <TouchableOpacity
      style={[
        styles.filterBtn,
        {
          backgroundColor:
            filterCount > 0 ? theme.veloBlueDim : theme.surfaceVariant,
        },
      ]}
      onPress={() => setFilterSheetVisible(true)}
      activeOpacity={0.7}
    >
      <SlidersHorizontal
        size={16}
        color={filterCount > 0 ? theme.veloBlue : theme.subtext}
      />
      {filterCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.veloBlue }]}>
          <Text style={styles.badgeText}>{filterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.headerWrap, { borderBottomColor: theme.border }]}>
        <AppHeader
          title="Transactions"
          subtitle="Your spending history"
          rightElement={rightElement}
        />
      </View>

      <View style={styles.listWrap}>
        <TransactionsList filters={filters} onStatsChange={setStats} />
      </View>

      <AddExpenseModal
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />

      <View
        style={[
          styles.totalBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <Text style={[styles.totalCount, { color: theme.subtext }]}>
          {stats.count} {stats.count === 1 ? "transaction" : "transactions"}
        </Text>
        <View style={styles.totalRight}>
          <Text style={[styles.totalLabel, { color: theme.subtext }]}>
            Total
          </Text>
          <Text style={[styles.totalAmount, { color: theme.text }]}>
            ₹{stats.total.toLocaleString()}
          </Text>
        </View>
      </View>

      <TransactionFilterSheet
        visible={filterSheetVisible}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterSheetVisible(false)}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.veloBlue }]}
        onPress={() => setShowAddExpense(true)}
        activeOpacity={0.85}
      >
        <Plus size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listWrap: { flex: 1 },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 9, fontFamily: "Inter-Bold", color: "#FFFFFF" },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalCount: { fontSize: 13, fontFamily: "Inter-Regular" },
  totalRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  totalLabel: { fontSize: 13, fontFamily: "Inter-Regular" },
  totalAmount: { fontSize: 16, fontFamily: "Inter-Black" },
  fab: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    opacity: 0.85,
  },
});
