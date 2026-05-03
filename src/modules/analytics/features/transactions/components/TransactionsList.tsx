import { FilterTabs, MultiFilterTabs } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Category,
  getTransactions,
  PaymentType,
  PeriodPreset,
} from "../services/transactionsService";
import { CalendarRangePicker, DateRange } from "./CalendarRangePicker";
import { TransactionItem } from "./TransactionItem";

const PERIODS = ["Today", "This Week", "This Month", "Custom"];
const PAYMENT_TYPES = ["All", "UPI", "Cash", "Credit", "Debit"];
const CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Others",
];

export type TransactionStats = { count: number; total: number };

type Props = {
  onStatsChange: (stats: TransactionStats) => void;
};

export const TransactionsList = ({ onStatsChange }: Props) => {
  const theme = useTheme();
  const [period, setPeriod] = useState<PeriodPreset | "Custom">("This Week");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<string[]>(["All"]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const onStatsRef = useRef(onStatsChange);
  onStatsRef.current = onStatsChange;

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", period, paymentTypes, categories, customRange],
    queryFn: () =>
      getTransactions({
        period,
        customRange,
        paymentTypes: paymentTypes as (PaymentType | "All")[],
        categories: categories as (Category | "All")[],
      }),
  });

  useEffect(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    onStatsRef.current({ count: transactions.length, total });
  }, [transactions]);

  const handlePeriodChange = useCallback((tab: string) => {
    if (tab === "Custom") {
      setCalendarVisible(true);
    } else {
      setPeriod(tab as PeriodPreset);
      setCustomRange(undefined);
    }
  }, []);

  const handleApplyRange = useCallback((range: DateRange) => {
    setCustomRange(range);
    setPeriod("Custom");
  }, []);

  const periodLabel =
    period === "Custom" && customRange
      ? `${customRange.start} → ${customRange.end}`
      : period;

  const renderHeader = () => (
    <View style={styles.filters}>
      <View style={styles.filterGroup}>
        <Text style={[styles.filterLabel, { color: theme.subtext }]}>
          PERIOD
        </Text>
        <View style={styles.periodRow}>
          <FilterTabs
            tabs={PERIODS.filter((p) => p !== "Custom")}
            active={period === "Custom" ? "" : period}
            onChange={handlePeriodChange}
          />
          <TouchableOpacity
            style={[
              styles.customBtn,
              {
                backgroundColor:
                  period === "Custom" ? theme.veloBlue : theme.surfaceVariant,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setCalendarVisible(true)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.customBtnText,
                { color: period === "Custom" ? "#FFFFFF" : theme.subtext },
              ]}
            >
              {period === "Custom" && customRange ? "📅 Custom" : "Custom"}
            </Text>
          </TouchableOpacity>
        </View>
        {period === "Custom" && customRange && (
          <Text style={[styles.rangeHint, { color: theme.veloBlue }]}>
            {periodLabel}
          </Text>
        )}
      </View>

      <View style={styles.filterGroup}>
        <Text style={[styles.filterLabel, { color: theme.subtext }]}>
          PAYMENT TYPE
        </Text>
        <MultiFilterTabs
          tabs={PAYMENT_TYPES}
          selected={paymentTypes}
          onChange={setPaymentTypes}
        />
      </View>

      <View style={[styles.filterGroup, { marginBottom: 4 }]}>
        <Text style={[styles.filterLabel, { color: theme.subtext }]}>
          CATEGORY
        </Text>
        <MultiFilterTabs
          tabs={CATEGORIES}
          selected={categories}
          onChange={setCategories}
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <Text style={[styles.empty, { color: theme.subtext }]}>
      No transactions match the selected filters.
    </Text>
  );

  return (
    <>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: theme.surface },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <CalendarRangePicker
        visible={calendarVisible}
        initialRange={customRange}
        onClose={() => setCalendarVisible(false)}
        onApply={handleApplyRange}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 16 },
  filters: { paddingTop: 4, paddingBottom: 8 },
  filterGroup: { marginBottom: 12 },
  filterLabel: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  periodRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  customBtnText: { fontSize: 13, fontFamily: "Inter-Bold" },
  rangeHint: { fontSize: 11, fontFamily: "Inter-Regular", marginTop: 4 },
  empty: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    paddingVertical: 40,
  },
});
