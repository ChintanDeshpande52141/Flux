import {
  Step2Income,
  Step3Cards,
  Step4Savings,
} from "@/modules/onboarding/components";
import {
  useOnboarding,
  type CreditCard,
  type IncomeSource,
} from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const queryClient = useQueryClient();
  const { data: onboardingData, updateData, resetOnboarding } = useOnboarding();

  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [savingsGoalStr, setSavingsGoalStr] = useState("");
  const [saving, setSaving] = useState(false);

  const totalIncome = sources.reduce((s, x) => s + (Number(x.amount) || 0), 0);
  const savingsGoal = Number(savingsGoalStr) || 0;
  const totalCardLimit = cards.reduce((s, c) => s + c.limit, 0);
  const safeToSpend = totalIncome - savingsGoal;

  // Original data for dirty check
  const [originalData, setOriginalData] = useState({
    sources: [] as IncomeSource[],
    cards: [] as CreditCard[],
    savingsGoal: 0,
  });

  const hasChanges =
    JSON.stringify({ sources, cards, savingsGoal }) !==
    JSON.stringify(originalData);

  // Load data from context
  useEffect(() => {
    if (onboardingData) {
      const loadedSources = onboardingData.incomeSources || [];
      const loadedCards = onboardingData.creditCards || [];
      const loadedSavingsGoal = onboardingData.savingsGoal || 0;

      setSources(
        loadedSources.length > 0 ? loadedSources : [{ name: "", amount: 0 }],
      );
      setCards(loadedCards);
      setSavingsGoalStr(String(loadedSavingsGoal));
      setOriginalData({
        sources:
          loadedSources.length > 0 ? loadedSources : [{ name: "", amount: 0 }],
        cards: loadedCards,
        savingsGoal: loadedSavingsGoal,
      });
    }
  }, [onboardingData]);

  const handleDiscard = () => {
    setSources(originalData.sources);
    setCards(originalData.cards);
    setSavingsGoalStr(String(originalData.savingsGoal));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateData({
        incomeSources: sources.filter((s) => s.amount > 0),
        creditCards: cards,
        totalIncome,
        savingsGoal,
      });
      setOriginalData({
        sources: [...sources],
        cards: [...cards],
        savingsGoal,
      });
      // Invalidate safe-to-spend query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
      Alert.alert("Success", "Budget settings updated successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update budget settings. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Confirm Reset",
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text }]}>
            Budget Settings
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Income Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Income
            </Text>
            <View
              style={[
                styles.summaryChip,
                {
                  backgroundColor: theme.veloBlueDim,
                  borderColor: theme.veloBlue,
                },
              ]}
            >
              <Text style={[styles.summaryChipText, { color: theme.veloBlue }]}>
                Total: ₹{totalIncome.toLocaleString()}
              </Text>
            </View>
          </View>
          <Step2Income
            sources={sources}
            setSources={setSources}
            mode="settings"
          />
        </View>

        {/* Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Credit Cards
            </Text>
            {totalCardLimit > 0 && (
              <View
                style={[
                  styles.summaryChip,
                  {
                    backgroundColor: theme.veloBlueDim,
                    borderColor: theme.veloBlue,
                  },
                ]}
              >
                <Text
                  style={[styles.summaryChipText, { color: theme.veloBlue }]}
                >
                  Limit: ₹{totalCardLimit.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
          <Step3Cards cards={cards} setCards={setCards} mode="settings" />
        </View>

        {/* Savings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Savings Goal
            </Text>
            {safeToSpend > 0 && (
              <View
                style={[
                  styles.summaryChip,
                  {
                    backgroundColor: theme.veloBlueDim,
                    borderColor: theme.veloBlue,
                  },
                ]}
              >
                <Text
                  style={[styles.summaryChipText, { color: theme.veloBlue }]}
                >
                  Safe-to-spend: ₹{safeToSpend.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
          <Step4Savings
            savingsGoal={savingsGoalStr}
            setSavingsGoal={setSavingsGoalStr}
            totalIncome={totalIncome}
            mode="settings"
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetBtn, { borderColor: theme.danger }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.resetBtnText, { color: theme.danger }]}>
            Reset Budget Setup
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer with Save/Discard */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.discardBtn, { borderColor: theme.border }]}
          onPress={handleDiscard}
          disabled={!hasChanges}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.discardBtnText,
              { color: hasChanges ? theme.subtext : theme.subtextLight },
            ]}
          >
            Discard Changes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            {
              backgroundColor: theme.veloBlue,
              opacity: !hasChanges || saving ? 0.4 : 1,
            },
          ]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
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
    paddingBottom: 12,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  summaryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryChipText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  resetBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  discardBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  discardBtnText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
});
