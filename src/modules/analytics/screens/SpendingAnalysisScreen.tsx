import {
  AppHeader,
  Card,
  FluxLineChart,
  InsightItem,
  MetricCard,
  ProgressBar,
} from "@/shared/components";
import { useAuth } from "@/shared/context/AuthContext";
import { useTheme } from "@/shared/theme";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSpendingAnalysis } from "../features/spendingPulse/services/spendingAnalysisService";
import {
  TransactionsList,
  TransactionStats,
} from "../features/transactions/components/TransactionsList";

type Tab = "Overview" | "Transactions";

export const SpendingAnalysisScreen = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [stats, setStats] = useState<TransactionStats>({ count: 0, total: 0 });

  const { session } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["spending-analysis"],
    queryFn: getSpendingAnalysis,
    enabled: !!session,
  });

  const rightIcons = (
    <View style={styles.headerIcons}>
      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor: theme.surfaceVariant }]}
        onPress={() =>
          Share.share({ message: "Check my spending analysis on Flux!" })
        }
        activeOpacity={0.7}
      >
        <Share2 size={16} color={theme.subtext} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor: theme.surfaceVariant }]}
        activeOpacity={0.7}
      >
        <Download size={16} color={theme.subtext} />
      </TouchableOpacity>
    </View>
  );

  const dailyChartData =
    data?.dailyBreakdown.map((d) => ({ value: d.value, label: d.label })) ?? [];
  const monthlyChartData =
    data?.monthlyTrend.map((d) => ({ value: d.value, label: d.label })) ?? [];

  const tabSwitcher = (
    <View
      style={[
        styles.tabRow,
        {
          backgroundColor: theme.surfaceVariant,
          marginHorizontal: 20,
          marginBottom: 12,
        },
      ]}
    >
      {(["Overview", "Transactions"] as Tab[]).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              isActive && { backgroundColor: theme.surface },
            ]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.text : theme.subtext },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.headerWrap}>
        <AppHeader
          title="Spending Analysis"
          subtitle="Your spending patterns"
          rightElement={rightIcons}
        />
      </View>

      {isLoading || !data ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={theme.veloBlue} />
        </View>
      ) : (
        <>
          <View style={{ paddingHorizontal: 20 }}>
            <MetricCard
              label="This Week's Spending"
              amount={`₹${data.thisWeek.amount.toLocaleString()}`}
              rightIcon={
                <View
                  style={[
                    styles.trendBadge,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  {data.thisWeek.isUnder ? (
                    <TrendingDown size={14} color="#FFFFFF" />
                  ) : (
                    <TrendingUp size={14} color="#FFFFFF" />
                  )}
                </View>
              }
            >
              <View style={styles.heroFooter}>
                <Text style={styles.heroSub}>
                  vs Budget ₹{data.thisWeek.budget.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.underBadge,
                    { backgroundColor: "rgba(16,185,129,0.25)" },
                  ]}
                >
                  <Text style={styles.underText}>
                    ↓ {data.thisWeek.percentUnder}% under
                  </Text>
                </View>
              </View>
            </MetricCard>
          </View>
          {tabSwitcher}

          {activeTab === "Overview" ? (
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Daily Breakdown */}
              <Card padding={20}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Daily Breakdown
                </Text>
                <FluxLineChart
                  data={dailyChartData}
                  height={130}
                  showRules
                  showYAxis
                  noOfSections={4}
                />
              </Card>

              {/* Category Breakdown */}
              <Card padding={20}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Category Breakdown
                </Text>
                <View style={styles.categoryList}>
                  {data.categoryBreakdown.map((cat) => (
                    <View key={cat.label} style={styles.categoryRow}>
                      <View style={styles.catLabelRow}>
                        <Text style={[styles.catLabel, { color: theme.text }]}>
                          {cat.label}
                        </Text>
                        <View style={styles.catRight}>
                          <Text
                            style={[
                              styles.catPercent,
                              { color: theme.subtext },
                            ]}
                          >
                            {cat.percent}%
                          </Text>
                          <Text
                            style={[styles.catAmount, { color: theme.text }]}
                          >
                            ₹{cat.amount.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <ProgressBar
                        progress={cat.percent / 100}
                        color={cat.color}
                        height={6}
                      />
                    </View>
                  ))}
                </View>
              </Card>

              {/* Monthly Trend */}
              <Card padding={20}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Monthly Trend
                </Text>
                <FluxLineChart
                  data={monthlyChartData}
                  height={110}
                  initialSpacing={20}
                  endSpacing={20}
                />
                <View style={[styles.avgRow, { borderTopColor: theme.border }]}>
                  <Text style={[styles.avgLabel, { color: theme.subtext }]}>
                    Average monthly spending
                  </Text>
                  <Text style={[styles.avgAmount, { color: theme.text }]}>
                    ₹{data.avgMonthlySpending.toLocaleString()}
                  </Text>
                </View>
              </Card>

              {/* Insights */}
              <Text style={[styles.insightsTitle, { color: theme.text }]}>
                Insights
              </Text>
              {data.insights.map((insight) => (
                <InsightItem
                  key={insight.id}
                  title={insight.title}
                  body={insight.body}
                  accentColor={
                    insight.type === "warning"
                      ? theme.warning
                      : insight.type === "success"
                        ? theme.success
                        : theme.veloBlue
                  }
                  icon={
                    insight.type === "warning" ? (
                      <AlertTriangle size={16} color={theme.warning} />
                    ) : (
                      <CheckCircle size={16} color={theme.success} />
                    )
                  }
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.transactionsWrap}>
              <TransactionsList onStatsChange={setStats} />

              {/* Sticky total bar */}
              <View
                style={[
                  styles.totalBar,
                  {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.totalCount, { color: theme.subtext }]}>
                  {stats.count}{" "}
                  {stats.count === 1 ? "transaction" : "transactions"}
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
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { paddingHorizontal: 20, paddingTop: 8 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trendBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  heroFooter: { flexDirection: "row", alignItems: "center", gap: 10 },
  heroSub: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.75)",
  },
  underBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  underText: { fontSize: 12, fontFamily: "Inter-Bold", color: "#10B981" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter-Bold", marginBottom: 16 },
  categoryList: { gap: 14 },
  categoryRow: { gap: 8 },
  catLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catLabel: { fontSize: 13, fontFamily: "Inter-Regular", flex: 1 },
  catRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  catPercent: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    width: 32,
    textAlign: "right",
  },
  catAmount: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
    width: 64,
    textAlign: "right",
  },
  avgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  avgLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  avgAmount: { fontSize: 14, fontFamily: "Inter-Bold" },
  insightsTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginBottom: 12,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  tabLabel: { fontSize: 13, fontFamily: "Inter-Bold" },
  transactionsWrap: { flex: 1 },
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
  spinnerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
