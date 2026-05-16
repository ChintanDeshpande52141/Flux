import { useTotalTracked } from "@/modules/analytics/features/profile/hooks/useTotalTracked";
import { useSafeToSpend } from "@/modules/analytics/features/safeToSpend/hooks/useSafeToSpend";
import { Card } from "@/shared/components";
import { PersonalInfoSheet } from "@/shared/components/PersonalInfoSheet";
import { useAuth } from "@/shared/context/AuthContext";
import { useOnboarding } from "@/shared/context/OnboardingContext";
import { useThemeContext } from "@/shared/context/ThemeContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  DollarSign,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Palette,
  Target,
  TrendingUp,
  User,
  UserCircle,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const { resetOnboarding, data: onboardingData } = useOnboarding();
  const { data: totalsData } = useTotalTracked();
  const { data: safeToSpendData } = useSafeToSpend();
  const { themeMode, toggleTheme } = useThemeContext();
  const { updateProfile } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [showPersonalInfoSheet, setShowPersonalInfoSheet] = useState(false);

  if (authLoading) {
    return null;
  }

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || "—",
  );
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const totalTracked = totalsData?.totalTracked || 0;

  // Handle loading state for totals
  const isTotalsLoading = false;

  const formatTotalTracked = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  const handleSavePersonalInfo = async (data: {
    fullName: string;
    age: string;
    country: string;
    profession: string;
  }) => {
    const COUNTRIES = [
      { name: "India", currency: "INR" },
      { name: "United States", currency: "USD" },
      { name: "United Kingdom", currency: "GBP" },
      { name: "Canada", currency: "CAD" },
      { name: "Australia", currency: "AUD" },
      { name: "Germany", currency: "EUR" },
      { name: "France", currency: "EUR" },
      { name: "Japan", currency: "JPY" },
      { name: "Singapore", currency: "SGD" },
      { name: "UAE", currency: "AED" },
    ] as const;
    const selectedCountry = COUNTRIES.find((c) => c.name === data.country);
    await updateProfile({
      full_name: data.fullName.trim(),
      age: data.age ? Number(data.age) : undefined,
      country: data.country,
      currency: selectedCountry?.currency,
      profession: data.profession.trim() || undefined,
    });
    // Optimistic UI update
    setFullName(data.fullName.trim() || "—");
  };

  const handleSignOut = () => {
    const confirmed =
      Platform.OS === "web"
        ? Promise.resolve(window.confirm("Are you sure you want to sign out?"))
        : new Promise((resolve) => {
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

  const handleComingSoon = () => {
    Alert.alert("Coming Soon", "This feature will be available soon.");
  };

  return (
    <>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>
              Profile
            </Text>
            <Text style={[styles.pageSubtitle, { color: theme.subtext }]}>
              Manage your account and preferences
            </Text>
          </View>

          {/* Hero Card */}
          <View style={[styles.heroCard, { backgroundColor: theme.veloBlue }]}>
            <View style={styles.heroContent}>
              <View style={styles.avatarCircle}>
                <User size={24} color="#FFFFFF" />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroName}>{fullName}</Text>
                <Text style={styles.heroEmail}>{user?.email ?? "—"}</Text>
              </View>
            </View>
            <View
              style={[
                styles.heroDivider,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            />
            <View style={styles.heroStats}>
              <View>
                <Text style={styles.heroStatLabel}>Member Since</Text>
                <Text style={styles.heroStatValue}>{memberSince}</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View>
                <Text style={styles.heroStatLabel}>Total Tracked</Text>
                <Text style={styles.heroStatValue}>
                  {formatTotalTracked(totalTracked)}
                </Text>
              </View>
            </View>
          </View>

          {/* Snapshot Cards */}
          <View style={styles.snapshotRow}>
            {/* Monthly Income */}
            <View
              style={[
                styles.snapshotCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.snapshotIconBadge,
                  { backgroundColor: theme.veloBlueDim },
                ]}
              >
                <TrendingUp size={14} color={theme.veloBlue} />
              </View>
              <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>
                Income
              </Text>
              <Text style={[styles.snapshotValue, { color: theme.text }]}>
                {onboardingData?.totalIncome
                  ? `₹${onboardingData.totalIncome.toLocaleString()}`
                  : "—"}
              </Text>
            </View>
            {/* Savings Goal */}
            <View
              style={[
                styles.snapshotCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.snapshotIconBadge,
                  { backgroundColor: "rgba(251,146,60,0.15)" },
                ]}
              >
                <Target size={14} color="#F97316" />
              </View>
              <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>
                Savings
              </Text>
              <Text style={[styles.snapshotValue, { color: theme.text }]}>
                {onboardingData?.savingsGoal
                  ? `₹${onboardingData.savingsGoal.toLocaleString()}`
                  : "—"}
              </Text>
            </View>
            {/* Safe-to-Spend */}
            <View
              style={[styles.snapshotCard, { backgroundColor: theme.veloBlue }]}
            >
              <View
                style={[
                  styles.snapshotIconBadge,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text
                style={[
                  styles.snapshotLabel,
                  { color: "rgba(255,255,255,0.75)" },
                ]}
              >
                Safe Spend
              </Text>
              <Text style={[styles.snapshotValue, { color: "#FFFFFF" }]}>
                {safeToSpendData
                  ? `₹${safeToSpendData.amount.toLocaleString()}`
                  : "—"}
              </Text>
            </View>
          </View>

          {/* FINANCIAL */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
            FINANCIAL
          </Text>
          <Card padding={0} style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.sectionRow, { borderBottomColor: theme.border }]}
              onPress={() => router.push("/budget-settings")}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <DollarSign size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Budget Settings
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
          </Card>

          {/* ACCOUNT */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
            ACCOUNT
          </Text>
          <Card padding={0} style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.sectionRow, { borderBottomColor: theme.border }]}
              onPress={() => setShowPersonalInfoSheet(true)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <UserCircle size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Personal Information
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sectionRow, { borderBottomColor: theme.border }]}
              onPress={handleComingSoon}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <Bell size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionRow}
              onPress={handleComingSoon}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <Lock size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Privacy & Security
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
          </Card>

          {/* PREFERENCES */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
            PREFERENCES
          </Text>
          <Card padding={0} style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.sectionRow, { borderBottomColor: theme.border }]}
              onPress={handleComingSoon}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <Palette size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Appearance
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
            <View
              style={[styles.sectionRow, { justifyContent: "space-between" }]}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <Moon size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={themeMode === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.veloBlue }}
                thumbColor={themeMode === "dark" ? "#FFFFFF" : theme.surface}
              />
            </View>
          </Card>

          {/* SUPPORT */}
          <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
            SUPPORT
          </Text>
          <Card padding={0} style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.sectionRow, { borderBottomColor: theme.border }]}
              onPress={handleComingSoon}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.veloBlueDim },
                  ]}
                >
                  <HelpCircle size={18} color={theme.veloBlue} />
                </View>
                <Text style={[styles.sectionText, { color: theme.text }]}>
                  Help & Feedback
                </Text>
              </View>
              <ChevronRight size={16} color={theme.subtext} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionRow}
              onPress={handleSignOut}
              disabled={signingOut}
              activeOpacity={0.7}
            >
              <View style={styles.sectionRowLeft}>
                <View
                  style={[
                    styles.sectionIcon,
                    { backgroundColor: theme.dangerDim },
                  ]}
                >
                  <LogOut size={18} color={theme.danger} />
                </View>
                <Text style={[styles.sectionText, { color: theme.danger }]}>
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </SafeAreaView>

      <PersonalInfoSheet
        visible={showPersonalInfoSheet}
        onClose={() => setShowPersonalInfoSheet(false)}
        onSave={handleSavePersonalInfo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 20 },
  pageHeader: { marginBottom: 24 },
  pageTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroText: { flex: 1 },
  heroName: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.7)",
  },
  heroDivider: {
    height: 1,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  heroStatLabel: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  heroStatValue: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "space-between",
  },
  sectionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionText: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
  },
  snapshotRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  snapshotCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  snapshotIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  snapshotLabel: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.3,
  },
  snapshotValue: {
    fontSize: 14,
    fontFamily: "Inter-Black",
  },
});
