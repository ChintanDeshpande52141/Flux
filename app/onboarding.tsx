import {
  NavBar,
  ProgressBar,
  Step1UserDetails,
  Step2Income,
  Step3Cards,
  Step4Savings,
} from "@/modules/onboarding/components";
import { useAuth } from "@/shared/context/AuthContext";
import {
  useOnboarding,
  type CreditCard,
  type IncomeSource,
} from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  CreditCard as CreditCardIcon,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOTAL_STEPS = 5;

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

function Step5Summary({
  sources,
  cards,
  savingsGoal,
  totalIncome,
}: {
  sources: IncomeSource[];
  cards: CreditCard[];
  savingsGoal: number;
  totalIncome: number;
}) {
  const theme = useTheme();
  const totalCardLimit = cards.reduce((s, c) => s + c.limit, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        You're all set! 🎉
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Here's a quick summary of your financial setup. You can always edit
        these from Settings.
      </Text>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.summaryIconWrap,
            { backgroundColor: theme.veloBlueDim },
          ]}
        >
          <TrendingUp size={18} color={theme.veloBlue} />
        </View>
        <View style={styles.summaryText}>
          <Text style={[styles.summaryLabel, { color: theme.subtext }]}>
            Monthly Income
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.text }]}>
            ₹{totalIncome.toLocaleString()}
          </Text>
          <Text style={[styles.summaryMeta, { color: theme.subtextLight }]}>
            From {sources.length} {sources.length === 1 ? "source" : "sources"}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View
          style={[styles.summaryIconWrap, { backgroundColor: "#10B98120" }]}
        >
          <CreditCardIcon size={18} color="#10B981" />
        </View>
        <View style={styles.summaryText}>
          <Text style={[styles.summaryLabel, { color: theme.subtext }]}>
            Credit Cards
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.text }]}>
            {cards.length > 0
              ? `${cards.length} ${cards.length === 1 ? "Card" : "Cards"}`
              : "No cards added"}
          </Text>
          {cards.length > 0 && (
            <Text style={[styles.summaryMeta, { color: theme.subtextLight }]}>
              Total limit: ₹{totalCardLimit.toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View
          style={[styles.summaryIconWrap, { backgroundColor: "#F59E0B20" }]}
        >
          <Wallet size={18} color="#F59E0B" />
        </View>
        <View style={styles.summaryText}>
          <Text style={[styles.summaryLabel, { color: theme.subtext }]}>
            Savings Goal
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.text }]}>
            {savingsGoal > 0
              ? `₹${savingsGoal.toLocaleString()}`
              : "No goal set"}
          </Text>
          {savingsGoal > 0 && (
            <Text style={[styles.summaryMeta, { color: theme.subtextLight }]}>
              Per month
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.nextStepsBox, { backgroundColor: theme.veloBlue }]}>
        <Text style={styles.nextStepsTitle}>Next Steps</Text>
        {[
          "Add your fixed bills (rent, subscriptions, EMIs)",
          "Start tracking expenses via chat or manual entry",
          "Monitor your spending velocity and stay on track",
        ].map((item) => (
          <View key={item} style={styles.nextStepsRow}>
            <CheckCircle size={14} color="#FFFFFF" />
            <Text style={styles.nextStepsItem}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const { updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");

  const [sources, setSources] = useState<IncomeSource[]>([
    { name: "", amount: 0 },
  ]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [savingsGoalStr, setSavingsGoalStr] = useState("");

  const totalIncome = sources.reduce((s, x) => s + (Number(x.amount) || 0), 0);
  const savingsGoal = Number(savingsGoalStr) || 0;

  const canContinueStep1 = fullName.trim().length > 0 && country.length > 0;
  const canContinueStep2 = totalIncome > 0;

  const goNext = async () => {
    if (step === 1) {
      const selectedCountry = COUNTRIES.find((c) => c.name === country);
      try {
        await updateProfile({
          full_name: fullName.trim(),
          age: Number(age) || undefined,
          country,
          currency: selectedCountry?.currency,
          profession: profession.trim() || undefined,
        });
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setSaving(true);
    await completeOnboarding({
      incomeSources: sources.filter((s) => s.amount > 0),
      totalIncome,
      savingsGoal,
      creditCards: cards,
    });
    router.replace("/(tabs)/analytics");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressBar step={step} />

        <View style={styles.flex}>
          {step === 1 && (
            <Step1UserDetails
              fullName={fullName}
              setFullName={setFullName}
              age={age}
              setAge={setAge}
              country={country}
              setCountry={setCountry}
              profession={profession}
              setProfession={setProfession}
            />
          )}
          {step === 2 && (
            <Step2Income
              sources={sources}
              setSources={setSources}
              mode="onboarding"
            />
          )}
          {step === 3 && (
            <Step3Cards cards={cards} setCards={setCards} mode="onboarding" />
          )}
          {step === 4 && (
            <Step4Savings
              savingsGoal={savingsGoalStr}
              setSavingsGoal={setSavingsGoalStr}
              totalIncome={totalIncome}
              mode="onboarding"
            />
          )}
          {step === 5 && (
            <Step5Summary
              sources={sources}
              cards={cards}
              savingsGoal={savingsGoal}
              totalIncome={totalIncome}
            />
          )}
        </View>

        {step === 1 && (
          <NavBar
            showBack={false}
            onContinue={goNext}
            continueDisabled={!canContinueStep1}
          />
        )}
        {step === 2 && (
          <NavBar
            onBack={goBack}
            onContinue={goNext}
            onSkip={goNext}
            showSkip
            continueDisabled={!canContinueStep2}
          />
        )}
        {step === 3 && (
          <NavBar
            onBack={goBack}
            onContinue={goNext}
            onSkip={goNext}
            showSkip
          />
        )}
        {step === 4 && (
          <NavBar
            onBack={goBack}
            onContinue={goNext}
            onSkip={goNext}
            showSkip
          />
        )}
        {step === 5 && (
          <NavBar
            onBack={goBack}
            onContinue={handleFinish}
            continueLabel="Start Using Flux"
            loading={saving}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  progressWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  stepLabel: { fontSize: 12, fontFamily: "Inter-Regular", marginBottom: 4 },
  pctLabel: {
    position: "absolute",
    right: 20,
    top: 12,
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
  track: { height: 4, borderRadius: 2, overflow: "hidden", marginTop: 4 },
  fill: { height: 4, borderRadius: 2 },
  stepContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  sourceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceIndex: { fontSize: 12, fontFamily: "Inter-Bold", letterSpacing: 0.3 },
  nameInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  rupee: { fontSize: 16, fontFamily: "Inter-Bold", marginRight: 6 },
  amountInput: { flex: 1, fontSize: 20, fontFamily: "Inter-Bold" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addBtnText: { fontSize: 14, fontFamily: "Inter-Bold" },
  totalBox: { borderRadius: 14, padding: 16, gap: 4 },
  totalBoxLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  totalBoxAmount: { fontSize: 28, fontFamily: "Inter-Black" },
  cardRow: { flexDirection: "row" },
  cardFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  tipBox: { borderRadius: 12, padding: 14, marginTop: 4 },
  tipText: { fontSize: 13, fontFamily: "Inter-Regular", lineHeight: 18 },
  tipBold: { fontFamily: "Inter-Bold" },
  quickRow: { flexDirection: "row", gap: 8 },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipText: { fontSize: 13, fontFamily: "Inter-Bold" },
  previewBox: { borderRadius: 14, padding: 16, gap: 10, marginTop: 4 },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: { fontSize: 13, fontFamily: "Inter-Regular" },
  previewValue: { fontSize: 14, fontFamily: "Inter-Bold" },
  previewLabelBold: { fontSize: 14, fontFamily: "Inter-Bold" },
  previewAmountBold: { fontSize: 22, fontFamily: "Inter-Black" },
  previewDivider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryText: { flex: 1, gap: 2 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter-Regular" },
  summaryAmount: { fontSize: 20, fontFamily: "Inter-Bold" },
  summaryMeta: { fontSize: 12, fontFamily: "Inter-Regular" },
  nextStepsBox: { borderRadius: 14, padding: 18, gap: 10, marginTop: 4 },
  nextStepsTitle: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  nextStepsRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  nextStepsItem: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 18,
  },
  navBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  navRow: { flexDirection: "row", gap: 12 },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: 15, fontFamily: "Inter-Bold" },
  continueBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continueBtnText: { fontSize: 15, fontFamily: "Inter-Bold", color: "#FFFFFF" },
  skipBtn: { alignItems: "center" },
  skipText: { fontSize: 13, fontFamily: "Inter-Regular" },
});
