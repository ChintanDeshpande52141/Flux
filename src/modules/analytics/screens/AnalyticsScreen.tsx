import { FilterTabs } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { SlidersHorizontal, Zap } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeToSpendCard } from "../features/safeToSpend/components/SafeToSpendCard";
import { useSafeToSpend } from "../features/safeToSpend/hooks/useSafeToSpend";
import { SpendingPulseCard } from "../features/spendingPulse/components/SpendingPulseCard";
import { useSpendingPulse } from "../features/spendingPulse/hooks/useSpendingPulse";
import { SpendingVelocityCard } from "../features/spendingVelocity/components/SpendingVelocityCard";
import { useSpendingVelocity } from "../features/spendingVelocity/hooks/useSpendingVelocity";
import { AnalyticsProvider } from "../store/AnalyticsProvider";

const FILTER_TABS = ["All", "UPI", "Cash", "Credit", "Debit"];

const AnalyticsContent = () => {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const { loading: loadingA, error: errorA } = useSafeToSpend();
  const { loading: loadingB, error: errorB } = useSpendingPulse();
  const { loading: loadingC, error: errorC } = useSpendingVelocity();
  const isLoading = loadingA || loadingB || loadingC;
  const hasError = !isLoading && !!(errorA || errorB || errorC);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={[styles.logoIcon, { backgroundColor: theme.text }]}>
              <Zap size={14} color={theme.surface} fill={theme.surface} />
            </View>
            <Text style={[styles.logoText, { color: theme.text }]}>Pulse</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { backgroundColor: theme.surfaceVariant },
            ]}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={16} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={theme.veloBlue} />
          </View>
        ) : hasError ? (
          <View style={styles.spinnerContainer}>
            <Text style={[styles.errorText, { color: theme.subtext }]}>
              Something went wrong.{"\n"}Pull down to retry.
            </Text>
          </View>
        ) : (
          <>
            <SafeToSpendCard />
            <SpendingPulseCard />
            <SpendingVelocityCard />
          </>
        )}

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: theme.subtext }]}>
            FILTER SPENDING
          </Text>
          <FilterTabs
            tabs={FILTER_TABS}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const AnalyticsScreen = () => (
  <AnalyticsProvider>
    <AnalyticsContent />
  </AnalyticsProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 20, fontFamily: "Inter-Bold" },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: { paddingVertical: 60, alignItems: "center" },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  filterSection: { marginTop: 8 },
  filterLabel: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
});
