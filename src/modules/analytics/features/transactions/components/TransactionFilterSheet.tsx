import { FilterTabs, MultiFilterTabs } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Category,
  PaymentType,
  PeriodPreset,
  TransactionFilters,
} from "../services/transactionsService";
import { CalendarRangePicker, DateRange } from "./CalendarRangePicker";

const PERIOD_TABS: (PeriodPreset)[] = ["Today", "This Week", "This Month"];
const PAYMENT_TYPES = ["All", "UPI", "Cash", "Credit", "Debit"];
const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Entertainment", "Others"];

const DEFAULT_FILTERS: TransactionFilters = {
  period: "This Week",
  paymentTypes: ["All"],
  categories: ["All"],
};

type Props = {
  visible: boolean;
  filters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onClose: () => void;
};

export const TransactionFilterSheet = ({
  visible,
  filters,
  onApply,
  onClose,
}: Props) => {
  const theme = useTheme();

  const [localPeriod, setLocalPeriod] = useState<PeriodPreset | "Custom">(filters.period);
  const [localCustomRange, setLocalCustomRange] = useState<DateRange | undefined>(filters.customRange);
  const [localPaymentTypes, setLocalPaymentTypes] = useState<string[]>(filters.paymentTypes);
  const [localCategories, setLocalCategories] = useState<string[]>(filters.categories);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setLocalPeriod(filters.period);
      setLocalCustomRange(filters.customRange);
      setLocalPaymentTypes(filters.paymentTypes);
      setLocalCategories(filters.categories);
    }
  }, [visible]);

  const handlePeriodChange = useCallback((tab: string) => {
    if (tab === "Custom") {
      setCalendarVisible(true);
    } else {
      setLocalPeriod(tab as PeriodPreset);
      setLocalCustomRange(undefined);
    }
  }, []);

  const handleApplyRange = useCallback((range: DateRange) => {
    setLocalCustomRange(range);
    setLocalPeriod("Custom");
  }, []);

  const handleApply = () => {
    onApply({
      period: localPeriod,
      customRange: localCustomRange,
      paymentTypes: localPaymentTypes as (PaymentType | "All")[],
      categories: localCategories as (Category | "All")[],
    });
    onClose();
  };

  const handleReset = () => {
    setLocalPeriod(DEFAULT_FILTERS.period);
    setLocalCustomRange(undefined);
    setLocalPaymentTypes(DEFAULT_FILTERS.paymentTypes);
    setLocalCategories(DEFAULT_FILTERS.categories);
  };

  const activeFiltersCount =
    (localPeriod !== "This Week" ? 1 : 0) +
    (localPaymentTypes[0] !== "All" || localPaymentTypes.length > 1 ? 1 : 0) +
    (localCategories[0] !== "All" || localCategories.length > 1 ? 1 : 0);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                Filters
                {activeFiltersCount > 0 && (
                  <Text style={{ color: theme.veloBlue }}> · {activeFiltersCount}</Text>
                )}
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Text style={[styles.closeBtn, { color: theme.subtext }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: theme.subtext }]}>
                  PERIOD
                </Text>
                <View style={styles.periodRow}>
                  <FilterTabs
                    tabs={PERIOD_TABS}
                    active={localPeriod === "Custom" ? "" : localPeriod}
                    onChange={handlePeriodChange}
                  />
                  <TouchableOpacity
                    style={[
                      styles.customBtn,
                      {
                        backgroundColor:
                          localPeriod === "Custom"
                            ? theme.veloBlue
                            : theme.surfaceVariant,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setCalendarVisible(true)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.customBtnText,
                        {
                          color:
                            localPeriod === "Custom" ? "#FFFFFF" : theme.subtext,
                        },
                      ]}
                    >
                      {localPeriod === "Custom" && localCustomRange
                        ? "📅 Custom"
                        : "Custom"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {localPeriod === "Custom" && localCustomRange && (
                  <Text style={[styles.rangeHint, { color: theme.veloBlue }]}>
                    {localCustomRange.start} → {localCustomRange.end}
                  </Text>
                )}
              </View>

              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: theme.subtext }]}>
                  PAYMENT TYPE
                </Text>
                <MultiFilterTabs
                  tabs={PAYMENT_TYPES}
                  selected={localPaymentTypes}
                  onChange={setLocalPaymentTypes}
                />
              </View>

              <View style={[styles.filterGroup, { marginBottom: 0 }]}>
                <Text style={[styles.filterLabel, { color: theme.subtext }]}>
                  CATEGORY
                </Text>
                <MultiFilterTabs
                  tabs={CATEGORIES}
                  selected={localCategories}
                  onChange={setLocalCategories}
                />
              </View>
            </ScrollView>

            <View
              style={[styles.actions, { borderTopColor: theme.border }]}
            >
              <TouchableOpacity
                style={[styles.resetBtn, { borderColor: theme.border }]}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Text style={[styles.resetText, { color: theme.subtext }]}>
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: theme.veloBlue }]}
                onPress={handleApply}
                activeOpacity={0.85}
              >
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CalendarRangePicker
        visible={calendarVisible}
        initialRange={localCustomRange}
        onClose={() => setCalendarVisible(false)}
        onApply={handleApplyRange}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: "85%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sheetTitle: { fontSize: 18, fontFamily: "Inter-Bold" },
  closeBtn: { fontSize: 18, paddingHorizontal: 4 },
  body: { flexGrow: 0 },
  bodyContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  filterGroup: { marginBottom: 20 },
  filterLabel: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  periodRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  customBtnText: { fontSize: 13, fontFamily: "Inter-Bold" },
  rangeHint: { fontSize: 11, fontFamily: "Inter-Regular", marginTop: 6 },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  resetText: { fontSize: 14, fontFamily: "Inter-Bold" },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  applyText: { fontSize: 14, fontFamily: "Inter-Bold", color: "#FFFFFF" },
});
