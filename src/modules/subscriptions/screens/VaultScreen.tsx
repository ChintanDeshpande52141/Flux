import { Card } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { Info, Plus, Zap } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SubscriptionList } from "../features/subscriptionList/components/SubscriptionList";
import { useSubscriptionList } from "../features/subscriptionList/hooks/useSubscriptionList";
import { SubscriptionsProvider } from "../store/SubscriptionsProvider";

const VaultContent = () => {
  const theme = useTheme();
  const { data } = useSubscriptionList();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, { backgroundColor: theme.text }]}>
            <Zap size={14} color={theme.surface} fill={theme.surface} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Fixed Bills</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <Plus size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {data && (
          <Card
            style={[styles.impactCard, { backgroundColor: theme.surface }]}
            padding={20}
          >
            <View style={styles.impactTop}>
              <View>
                <View style={styles.impactLabelRow}>
                  <Text style={[styles.impactLabel, { color: theme.subtext }]}>
                    + DAILY IMPACT
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Info size={13} color={theme.subtext} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.impactAmount, { color: theme.text }]}>
                  ₹{data.dailyImpact.toFixed(2)}
                </Text>
                <Text style={[styles.impactSub, { color: theme.subtext }]}>
                  Total recurring obligations calculated into a single daily
                  average.
                </Text>
              </View>
            </View>

            <View
              style={[styles.impactFooter, { borderTopColor: theme.border }]}
            >
              <View>
                <Text style={[styles.footerLabel, { color: theme.subtext }]}>
                  MONTHLY TOTAL
                </Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>
                  ₹{data.totalMonthly.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text style={[styles.footerLabel, { color: theme.subtext }]}>
                  UPCOMING
                </Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>
                  🗓 {data.upcomingCount} Bills
                </Text>
              </View>
            </View>
          </Card>
        )}

        <SubscriptionList />
      </ScrollView>
    </SafeAreaView>
  );
};

export const VaultScreen = () => (
  <SubscriptionsProvider>
    <VaultContent />
  </SubscriptionsProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontFamily: "Inter-Bold" },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: { padding: 20, paddingBottom: 40 },
  impactCard: { marginBottom: 24 },
  impactTop: { marginBottom: 16 },
  impactLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  impactLabel: { fontSize: 11, fontFamily: "Inter-Bold", letterSpacing: 0.6 },
  impactAmount: { fontSize: 36, fontFamily: "Inter-Black", marginBottom: 6 },
  impactSub: { fontSize: 12, fontFamily: "Inter-Regular", lineHeight: 18 },
  impactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLabel: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  footerValue: { fontSize: 16, fontFamily: "Inter-Bold" },
});
