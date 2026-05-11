import { useTheme } from "@/shared/theme";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  getTransactions,
  TransactionFilters,
} from "../services/transactionsService";
import { TransactionItem } from "./TransactionItem";

export type TransactionStats = { count: number; total: number };

type Props = {
  filters: TransactionFilters;
  onStatsChange: (stats: TransactionStats) => void;
};

export const TransactionsList = ({ filters, onStatsChange }: Props) => {
  const theme = useTheme();
  const onStatsRef = useRef(onStatsChange);
  onStatsRef.current = onStatsChange;

  const { data: transactions = [] } = useQuery({
    queryKey: [
      "transactions",
      filters.period,
      filters.paymentTypes,
      filters.categories,
      filters.customRange,
    ],
    queryFn: () => getTransactions(filters),
  });

  useEffect(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    onStatsRef.current({ count: transactions.length, total });
  }, [transactions]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.empty, { color: theme.subtext }]}>
        No transactions match the selected filters.
      </Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem item={item} />}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={[
        styles.listContent,
        transactions.length === 0 && styles.emptyContent,
        transactions.length === 0 && { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 16 },
  emptyContent: { flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
