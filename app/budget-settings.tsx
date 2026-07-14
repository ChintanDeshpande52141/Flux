import { useSafeToSpend } from "@/modules/analytics/features/safeToSpend/hooks/useSafeToSpend";
import { useSubscriptionList } from "@/modules/subscriptions/features/subscriptionList/hooks/useSubscriptionList";
import { useOnboarding } from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: onboardingData } = useOnboarding();
  const { data: safeToSpendData } = useSafeToSpend();
  const { data: subscriptionData } = useSubscriptionList();

  const totalIncome = onboardingData?.totalIncome ?? 0;
  const savingsGoal = onboardingData?.savingsGoal ?? 0;
  const cardCount = onboardingData?.creditCards?.length ?? 0;
  const totalCardLimit =
    onboardingData?.creditCards?.reduce((s, c) => s + c.limit, 0) ?? 0;
  // The API value is always the authoritative safe-to-spend total — never
  // recompute a competing figure here to display as the total.
  const safeToSpend = safeToSpendData?.amount ?? 0;
  const totalMonthlyBills = subscriptionData?.totalMonthly ?? 0;
  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  // Matches backend's round2 (Math.round(n * 100) / 100) so the reconciliation
  // check below uses the same rounding the API used to produce safeToSpend.
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const localSum = round2(totalIncome - totalMonthlyBills - savingsGoal);
  // Only compare once all three inputs have actually loaded — otherwise the
  // still-loading "0" defaults would falsely look like a discrepancy.
  const hasDiscrepancy =
    safeToSpendData !== null &&
    onboardingData !== null &&
    subscriptionData !== null &&
    round2(safeToSpend) !== localSum;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Budget Settings
          </Text>
          <Text style={[styles.headerSub, { color: theme.subtext }]}>
            Manage your financial configuration
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Safe-to-Spend Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.veloBlue }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Current Safe-to-Spend</Text>
              <Text style={styles.heroAmount}>{fmt(safeToSpend)}</Text>
            </View>
            <View style={styles.heroBadge}>
              <Zap size={18} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
          <View style={styles.heroBreakdown}>
            <View style={styles.heroRow}>
              <Text style={styles.heroRowLabel}>Monthly Income</Text>
              <Text style={styles.heroRowValue}>{fmt(totalIncome)}</Text>
            </View>
            <View style={styles.heroRow}>
              <Text style={styles.heroRowLabel}>– Fixed Bills</Text>
              <Text style={styles.heroRowValue}>{fmt(totalMonthlyBills)}</Text>
            </View>
            <View style={styles.heroRow}>
              <Text style={styles.heroRowLabel}>– Savings Goal</Text>
              <Text style={styles.heroRowValue}>{fmt(savingsGoal)}</Text>
            </View>
            <View style={[styles.heroRow, styles.heroRowSeparator]}>
              <Text style={styles.heroRowLabel}>= Safe-to-Spend</Text>
              <Text style={[styles.heroRowValue, styles.heroRowHighlight]}>
                {fmt(safeToSpend)}
              </Text>
            </View>
          </View>
          {hasDiscrepancy && (
            <Text style={styles.heroDiscrepancyNote}>
              These figures are out of sync with your latest safe-to-spend
              total — pull to refresh.
            </Text>
          )}
        </View>

        {/* Nav Rows */}
        <View
          style={[
            styles.navCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.navRow,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => router.push("/income-settings")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.navRowIcon,
                { backgroundColor: theme.veloBlueDim },
              ]}
            >
              <DollarSign size={18} color={theme.veloBlue} />
            </View>
            <View style={styles.navRowText}>
              <Text style={[styles.navRowLabel, { color: theme.text }]}>
                Income & Earnings
              </Text>
              <Text style={[styles.navRowSub, { color: theme.subtext }]}>
                Monthly income
              </Text>
            </View>
            <Text style={[styles.navRowValue, { color: theme.subtext }]}>
              {`₹${totalIncome.toLocaleString()}`}
            </Text>
            <ChevronRight size={16} color={theme.subtextLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navRow,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => router.push("/cards-settings")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.navRowIcon,
                { backgroundColor: theme.veloBlueDim },
              ]}
            >
              <CreditCard size={18} color={theme.veloBlue} />
            </View>
            <View style={styles.navRowText}>
              <Text style={[styles.navRowLabel, { color: theme.text }]}>
                Credit Cards
              </Text>
              <Text style={[styles.navRowSub, { color: theme.subtext }]}>
                {`₹${totalCardLimit.toLocaleString()} total limit`}
              </Text>
            </View>
            <Text style={[styles.navRowValue, { color: theme.subtext }]}>
              {`${cardCount} ${cardCount === 1 ? "Card" : "Cards"}`}
            </Text>
            <ChevronRight size={16} color={theme.subtextLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navRow,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => router.push("/savings-goals")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.navRowIcon,
                { backgroundColor: theme.veloBlueDim },
              ]}
            >
              <Target size={18} color={theme.veloBlue} />
            </View>
            <View style={styles.navRowText}>
              <Text style={[styles.navRowLabel, { color: theme.text }]}>
                Savings Goal
              </Text>
              <Text style={[styles.navRowSub, { color: theme.subtext }]}>
                Monthly target
              </Text>
            </View>
            <Text style={[styles.navRowValue, { color: theme.subtext }]}>
              {`₹${savingsGoal.toLocaleString()}`}
            </Text>
            <ChevronRight size={16} color={theme.subtextLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => router.push("/category-budgets")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.navRowIcon,
                { backgroundColor: theme.veloBlueDim },
              ]}
            >
              <TrendingUp size={18} color={theme.veloBlue} />
            </View>
            <View style={styles.navRowText}>
              <Text style={[styles.navRowLabel, { color: theme.text }]}>
                Category Budgets
              </Text>
              <Text style={[styles.navRowSub, { color: theme.subtext }]}>
                Set spending limits
              </Text>
            </View>
            <Text style={[styles.navRowValue, { color: theme.subtext }]}>
              Customize
            </Text>
            <ChevronRight size={16} color={theme.subtextLight} />
          </TouchableOpacity>
        </View>

        {/* How We Calculate */}
        <View
          style={[
            styles.explainCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.explainTitle, { color: theme.text }]}>
            How We Calculate Safe-to-Spend
          </Text>
          <View
            style={[
              styles.formulaBox,
              { backgroundColor: theme.surfaceVariant },
            ]}
          >
            <Text style={[styles.formula, { color: theme.text }]}>
              S = (I – B – G) – Eₚ
            </Text>
          </View>
          {[
            { key: "S", label: "Safe-to-Spend (liquid cash available)" },
            { key: "I", label: "Monthly Income (total take-home)" },
            { key: "B", label: "Fixed Bills (rent, EMI, subscriptions)" },
            { key: "G", label: "Savings Goal (what you save first)" },
            {
              key: "Eₚ",
              label: "Pending Expenses (already logged this month)",
            },
          ].map(({ key, label }) => (
            <View key={key} style={styles.explainRow}>
              <Text style={[styles.explainKey, { color: theme.veloBlue }]}>
                {key}
              </Text>
              <Text style={[styles.explainLabel, { color: theme.subtext }]}>
                {" "}
                = {label}
              </Text>
            </View>
          ))}
          <Text style={[styles.explainNote, { color: theme.subtext }]}>
            We subtract your fixed commitments and savings goal upfront, so you
            see a realistic "safe" amount you can actually spend without
            derailing your month.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.footerBtnOutline, { borderColor: theme.border }]}
          onPress={() => router.push("/(tabs)/vault")}
          activeOpacity={0.7}
        >
          <TrendingDown size={16} color={theme.text} />
          <Text style={[styles.footerBtnOutlineText, { color: theme.text }]}>
            Add Fixed Bill
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerBtnFill, { backgroundColor: theme.veloBlue }]}
          onPress={() => router.push("/category-budgets")}
          activeOpacity={0.8}
        >
          <Text style={styles.footerBtnFillText}>Set Budgets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontFamily: "Inter-Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 2 },
  content: { padding: 20, gap: 16, paddingBottom: 24 },

  // Hero
  heroCard: { borderRadius: 20, padding: 20 },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  heroAmount: { fontSize: 36, fontFamily: "Inter-Black", color: "#FFFFFF" },
  heroBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroBreakdown: { gap: 6 },
  heroRow: { flexDirection: "row", justifyContent: "space-between" },
  heroRowLabel: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.75)",
  },
  heroRowValue: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
  heroRowSeparator: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.25)",
    marginTop: 6,
    paddingTop: 6,
  },
  heroRowHighlight: {
    fontSize: 15,
    fontFamily: "Inter-Black",
    color: "#FFFFFF",
  },
  heroDiscrepancyNote: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 10,
  },

  // Nav rows
  navCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  navRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  navRowText: { flex: 1 },
  navRowLabel: { fontSize: 15, fontFamily: "Inter-Bold" },
  navRowSub: { fontSize: 12, fontFamily: "Inter-Regular", marginTop: 1 },
  navRowValue: { fontSize: 14, fontFamily: "Inter-Bold", marginRight: 4 },

  // Explain card
  explainCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  explainTitle: { fontSize: 16, fontFamily: "Inter-Bold", marginBottom: 12 },
  formulaBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  formula: { fontSize: 18, fontFamily: "Inter-Bold", fontStyle: "italic" },
  explainRow: { flexDirection: "row", marginBottom: 4 },
  explainKey: { fontSize: 13, fontFamily: "Inter-Bold", minWidth: 24 },
  explainLabel: { fontSize: 13, fontFamily: "Inter-Regular", flex: 1 },
  explainNote: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginTop: 12,
    lineHeight: 18,
  },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerBtnOutline: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerBtnOutlineText: { fontSize: 14, fontFamily: "Inter-Bold" },
  footerBtnFill: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  footerBtnFillText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
});
