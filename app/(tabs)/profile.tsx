import { Card } from "@/shared/components";
import { useAuth } from "@/shared/context/AuthContext";
import { useOnboarding } from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  LogOut,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { data, resetOnboarding } = useOnboarding();
  const [signingOut, setSigningOut] = useState(false);

  // const handleSignOut = () => {
  //   Alert.alert("Sign out", "Are you sure you want to sign out?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Sign out",
  //       style: "destructive",
  //       onPress: async () => {
  //         setSigningOut(true);
  //         await signOut();
  //       },
  //     },
  //   ]);
  // };
  const handleSignOut = () => {
    const confirmed =
      Platform.OS === "web"
        ? Promise.resolve(window.confirm("Are you sure you want to sign out?")) // Web: native browser confirm
        : new Promise((resolve) => {
            // Mobile: React Native Alert
            Alert.alert("Sign out", "Are you sure you want to sign out?", [
              { text: "Cancel", onPress: () => resolve(false) },
              {
                text: "Sign out",
                style: "destructive",
                onPress: () => resolve(true),
              },
            ]);
          });

    confirmed.then(async (yes) => {
      if (yes) {
        setSigningOut(true);
        await signOut();
      }
    });
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset setup",
      "This will clear your budget setup and take you back to onboarding. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetOnboarding();
            router.replace("/onboarding");
          },
        },
      ],
    );
  };

  const totalIncome = data?.totalIncome ?? 0;
  const savingsGoal = data?.savingsGoal ?? 0;
  const cardCount = data?.creditCards?.length ?? 0;
  const available = totalIncome - savingsGoal;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.veloBlue }]}>
            <Zap size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.email, { color: theme.text }]}>
              {user?.email ?? "—"}
            </Text>
            <Text style={[styles.joined, { color: theme.subtext }]}>
              Member since{" "}
              {user?.created_at ? new Date(user.created_at).getFullYear() : "—"}
            </Text>
          </View>
        </View>

        {/* Budget snapshot */}
        {data && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
              BUDGET SNAPSHOT
            </Text>
            <View style={styles.snapshotRow}>
              <View
                style={[
                  styles.snapshotCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <TrendingUp size={18} color={theme.veloBlue} />
                <Text style={[styles.snapshotAmount, { color: theme.text }]}>
                  ₹{totalIncome.toLocaleString()}
                </Text>
                <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>
                  Income
                </Text>
              </View>
              <View
                style={[
                  styles.snapshotCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <Target size={18} color="#F59E0B" />
                <Text style={[styles.snapshotAmount, { color: theme.text }]}>
                  {savingsGoal > 0 ? `₹${savingsGoal.toLocaleString()}` : "—"}
                </Text>
                <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>
                  Savings
                </Text>
              </View>
              <View
                style={[
                  styles.snapshotCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <CreditCard size={18} color="#10B981" />
                <Text style={[styles.snapshotAmount, { color: theme.text }]}>
                  {cardCount}
                </Text>
                <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>
                  Cards
                </Text>
              </View>
            </View>

            {available > 0 && (
              <View
                style={[
                  styles.availableBox,
                  { backgroundColor: theme.veloBlueDim },
                ]}
              >
                <Text style={[styles.availableLabel, { color: theme.subtext }]}>
                  Available for Spending
                </Text>
                <Text
                  style={[styles.availableAmount, { color: theme.veloBlue }]}
                >
                  ₹{available.toLocaleString()}
                </Text>
                <Text style={[styles.availableMeta, { color: theme.subtext }]}>
                  per month
                </Text>
              </View>
            )}
          </>
        )}

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          BUDGET SETTINGS
        </Text>
        <Card padding={0} style={styles.settingsCard}>
          <TouchableOpacity
            style={[styles.settingsRow, { borderBottomColor: theme.border }]}
            onPress={handleResetOnboarding}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingsIcon,
                { backgroundColor: theme.veloBlueDim },
              ]}
            >
              <RefreshCw size={16} color={theme.veloBlue} />
            </View>
            <View style={styles.settingsLabel}>
              <Text style={[styles.settingsText, { color: theme.text }]}>
                Edit Budget Setup
              </Text>
              <Text style={[styles.settingsMeta, { color: theme.subtext }]}>
                Update income, cards & savings goal
              </Text>
            </View>
            <ChevronRight size={16} color={theme.subtext} />
          </TouchableOpacity>
        </Card>

        {/* Account */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
          ACCOUNT
        </Text>
        <Card padding={0} style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={handleSignOut}
            disabled={signingOut}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.settingsIcon,
                { backgroundColor: theme.dangerDim },
              ]}
            >
              <LogOut size={16} color={theme.danger} />
            </View>
            <View style={styles.settingsLabel}>
              <Text style={[styles.settingsText, { color: theme.danger }]}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1, gap: 4 },
  email: { fontSize: 16, fontFamily: "Inter-Bold" },
  joined: { fontSize: 13, fontFamily: "Inter-Regular" },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  snapshotRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  snapshotCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  snapshotAmount: { fontSize: 16, fontFamily: "Inter-Bold" },
  snapshotLabel: { fontSize: 11, fontFamily: "Inter-Regular" },
  availableBox: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 4,
    marginBottom: 20,
  },
  availableLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  availableAmount: { fontSize: 28, fontFamily: "Inter-Black" },
  availableMeta: { fontSize: 12, fontFamily: "Inter-Regular" },
  settingsCard: { marginBottom: 20, borderRadius: 14, overflow: "hidden" },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsLabel: { flex: 1, gap: 2 },
  settingsText: { fontSize: 15, fontFamily: "Inter-Bold" },
  settingsMeta: { fontSize: 12, fontFamily: "Inter-Regular" },
});
