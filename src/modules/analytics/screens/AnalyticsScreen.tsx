import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { ArrowRight, Plus, Zap } from "lucide-react-native";
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
import { AddExpenseModal } from "../features/transactions/components/AddExpenseModal";
import { AnalyticsProvider } from "../store/AnalyticsProvider";

const TransactionsCTACard = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[
        styles.ctaCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
      onPress={() => router.push("/transactions")}
      activeOpacity={0.75}
    >
      <View style={styles.ctaLeft}>
        <Text style={[styles.ctaTitle, { color: theme.text }]}>
          Look into your Transactions
        </Text>
        <Text style={[styles.ctaSub, { color: theme.subtext }]}>
          Filter & explore your spending history
        </Text>
      </View>
      <ArrowRight size={18} color={theme.veloBlue} />
    </TouchableOpacity>
  );
};

const AnalyticsContent = () => {
  const theme = useTheme();
  const [showAddExpense, setShowAddExpense] = useState(false);

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
          <View style={styles.filterBtn} />
        </View>

        <AddExpenseModal
          visible={showAddExpense}
          onClose={() => setShowAddExpense(false)}
        />

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
            <TransactionsCTACard />
            <SpendingPulseCard />
            <SpendingVelocityCard />
          </>
        )}
      </ScrollView>

      {/* FAB */}
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

export const AnalyticsScreen = () => (
  <AnalyticsProvider>
    <AnalyticsContent />
  </AnalyticsProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  scroll: { padding: 20, paddingBottom: 20 },
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
  fab: {
    position: "absolute",
    bottom: 30,
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
  errorText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaLeft: { flex: 1, gap: 3 },
  ctaTitle: { fontSize: 14, fontFamily: "Inter-Bold" },
  ctaSub: { fontSize: 12, fontFamily: "Inter-Regular" },
});
