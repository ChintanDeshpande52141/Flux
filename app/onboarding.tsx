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
  Plus,
  Trash2,
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
  TextInput,
  TouchableOpacity,
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

function Step1UserDetails({
  fullName,
  setFullName,
  age,
  setAge,
  country,
  setCountry,
  profession,
  setProfession,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  profession: string;
  setProfession: (v: string) => void;
}) {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Let's get to know you
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Tell us a bit about yourself so we can personalize your experience.
      </Text>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Full Name *
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={theme.subtextLight}
        />
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Age
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={age}
          onChangeText={setAge}
          placeholder="Your age"
          placeholderTextColor={theme.subtextLight}
          keyboardType="numeric"
        />
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Country *
        </Text>
        <View
          style={[
            styles.nameInput,
            {
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={{ color: theme.text }}>
            {country || "Select your country"}
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: theme.veloBlue }}>Change</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[
                styles.quickChip,
                {
                  borderColor:
                    country === c.name ? theme.veloBlue : theme.border,
                  backgroundColor:
                    country === c.name
                      ? theme.veloBlueDim
                      : theme.surfaceVariant,
                },
              ]}
              onPress={() => setCountry(c.name)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickChipText,
                  {
                    color: country === c.name ? theme.veloBlue : theme.subtext,
                  },
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Profession
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={profession}
          onChangeText={setProfession}
          placeholder="e.g., Software Engineer, Student"
          placeholderTextColor={theme.subtextLight}
        />
      </View>
    </ScrollView>
  );
}

function ProgressBar({ step }: { step: number }) {
  const theme = useTheme();
  const pct = (step / TOTAL_STEPS) * 100;

  return (
    <View style={styles.progressWrap}>
      <Text style={[styles.stepLabel, { color: theme.subtext }]}>
        Step {step} of {TOTAL_STEPS}
      </Text>
      <Text style={[styles.pctLabel, { color: theme.veloBlue }]}>{pct}%</Text>
      <View style={[styles.track, { backgroundColor: theme.surfaceVariant }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.veloBlue,
              width: `${pct}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function NavBar({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  continueDisabled = false,
  showBack = true,
  showSkip = false,
  loading = false,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
  showSkip?: boolean;
  loading?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.navBar,
        { backgroundColor: theme.background, borderTopColor: theme.border },
      ]}
    >
      <View style={styles.navRow}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: theme.border }]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            {
              backgroundColor: theme.veloBlue,
              opacity: continueDisabled || loading ? 0.4 : 1,
            },
          ]}
          onPress={onContinue}
          disabled={continueDisabled || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>{continueLabel} ›</Text>
        </TouchableOpacity>
      </View>
      {showSkip && (
        <TouchableOpacity onPress={onSkip} hitSlop={8} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.subtext }]}>
            Skip this step
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function AmountInput({
  value,
  onChangeText,
  placeholder = "0",
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.amountRow,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.rupee, { color: theme.subtext }]}>₹</Text>
      <TextInput
        style={[styles.amountInput, { color: theme.text }]}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        placeholderTextColor={theme.subtextLight}
        keyboardType="numeric"
      />
    </View>
  );
}

function Step2Income({
  sources,
  setSources,
}: {
  sources: IncomeSource[];
  setSources: (s: IncomeSource[]) => void;
}) {
  const theme = useTheme();
  const total = sources.reduce((s, x) => s + (Number(x.amount) || 0), 0);

  const update = (i: number, field: keyof IncomeSource, val: string) => {
    const next = [...sources];
    if (field === "amount") next[i] = { ...next[i], amount: Number(val) || 0 };
    else next[i] = { ...next[i], name: val };
    setSources(next);
  };

  const add = () => setSources([...sources, { name: "", amount: 0 }]);
  const remove = (i: number) =>
    setSources(sources.filter((_, idx) => idx !== i));

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        What's your monthly income?
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Add all your income sources. We'll calculate your safe-to-spend amount
        based on this.
      </Text>

      {sources.map((src, i) => (
        <View
          key={i}
          style={[
            styles.sourceCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.sourceHeader}>
            <Text style={[styles.sourceIndex, { color: theme.subtext }]}>
              Income Source {i + 1}
            </Text>
            {sources.length > 1 && (
              <TouchableOpacity onPress={() => remove(i)} hitSlop={8}>
                <Trash2 size={16} color={theme.danger} />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[
              styles.nameInput,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            value={src.name}
            onChangeText={(v) => update(i, "name", v)}
            placeholder={i === 0 ? "Primary Salary" : "e.g., Freelance, Rental"}
            placeholderTextColor={theme.subtextLight}
          />
          <AmountInput
            value={src.amount ? String(src.amount) : ""}
            onChangeText={(v) => update(i, "amount", v)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addBtn, { borderColor: theme.border }]}
        onPress={add}
        activeOpacity={0.7}
      >
        <Plus size={16} color={theme.veloBlue} />
        <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>
          Add Another Income Source
        </Text>
      </TouchableOpacity>

      {total > 0 && (
        <View style={[styles.totalBox, { backgroundColor: theme.veloBlueDim }]}>
          <Text style={[styles.totalBoxLabel, { color: theme.subtext }]}>
            Total Monthly Income
          </Text>
          <Text style={[styles.totalBoxAmount, { color: theme.text }]}>
            ₹{total.toLocaleString()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function Step3Cards({
  cards,
  setCards,
}: {
  cards: CreditCard[];
  setCards: (c: CreditCard[]) => void;
}) {
  const theme = useTheme();

  const update = (i: number, field: keyof CreditCard, val: string) => {
    const next = [...cards];
    const num = Number(val) || 0;
    if (field === "name") next[i] = { ...next[i], name: val };
    else if (field === "limit") {
      next[i] = { ...next[i], limit: num, spendCap: Math.round(num * 0.3) };
    } else {
      next[i] = { ...next[i], spendCap: num };
    }
    setCards(next);
  };

  const add = () => setCards([...cards, { name: "", limit: 0, spendCap: 0 }]);
  const remove = (i: number) => setCards(cards.filter((_, idx) => idx !== i));

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Add your credit cards
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Track credit limits and set spending caps. We'll alert you when you
        reach 30% of your limit.
      </Text>

      {cards.map((card, i) => (
        <View
          key={i}
          style={[
            styles.sourceCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.sourceHeader}>
            <Text style={[styles.sourceIndex, { color: theme.subtext }]}>
              Card {i + 1}
            </Text>
            <TouchableOpacity onPress={() => remove(i)} hitSlop={8}>
              <Trash2 size={16} color={theme.danger} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.nameInput,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            value={card.name}
            onChangeText={(v) => update(i, "name", v)}
            placeholder="e.g., HDFC Regalia, Amex Platinum"
            placeholderTextColor={theme.subtextLight}
          />
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
                Credit Limit
              </Text>
              <AmountInput
                value={card.limit ? String(card.limit) : ""}
                onChangeText={(v) => update(i, "limit", v)}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
                Your Spend Cap
              </Text>
              <AmountInput
                value={card.spendCap ? String(card.spendCap) : ""}
                onChangeText={(v) => update(i, "spendCap", v)}
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addBtn, { borderColor: theme.border }]}
        onPress={add}
        activeOpacity={0.7}
      >
        <Plus size={16} color={theme.veloBlue} />
        <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>
          Add Another Card
        </Text>
      </TouchableOpacity>

      <View style={[styles.tipBox, { backgroundColor: theme.warningDim }]}>
        <Text style={[styles.tipText, { color: theme.warning }]}>
          <Text style={styles.tipBold}>Pro Tip: </Text>
          We recommend keeping your spend cap at 30% of your credit limit to
          maintain a healthy credit score.
        </Text>
      </View>
    </ScrollView>
  );
}

function Step4Savings({
  savingsGoal,
  setSavingsGoal,
  totalIncome,
}: {
  savingsGoal: string;
  setSavingsGoal: (v: string) => void;
  totalIncome: number;
}) {
  const theme = useTheme();
  const goal = Number(savingsGoal) || 0;
  const available = totalIncome - goal;
  const QUICK = [5000, 10000, 20000];

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Set your savings goal
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        How much do you want to save each month? We'll deduct this from your
        safe-to-spend amount.
      </Text>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Monthly Savings Target
        </Text>
        <AmountInput
          value={savingsGoal}
          onChangeText={setSavingsGoal}
          placeholder="0"
        />
        <View style={styles.quickRow}>
          {QUICK.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.quickChip,
                {
                  borderColor: goal === q ? theme.veloBlue : theme.border,
                  backgroundColor:
                    goal === q ? theme.veloBlueDim : theme.surfaceVariant,
                },
              ]}
              onPress={() => setSavingsGoal(String(q))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickChipText,
                  { color: goal === q ? theme.veloBlue : theme.subtext },
                ]}
              >
                ₹{(q / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {totalIncome > 0 && (
        <View
          style={[styles.previewBox, { backgroundColor: theme.veloBlueDim }]}
        >
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabel, { color: theme.subtext }]}>
              Income
            </Text>
            <Text style={[styles.previewValue, { color: theme.text }]}>
              ₹{totalIncome.toLocaleString()}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabel, { color: theme.subtext }]}>
              Savings Goal
            </Text>
            <Text style={[styles.previewValue, { color: theme.danger }]}>
              {goal > 0 ? `−₹${goal.toLocaleString()}` : "₹0"}
            </Text>
          </View>
          <View
            style={[styles.previewDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.previewRow}>
            <Text style={[styles.previewLabelBold, { color: theme.text }]}>
              Available for Spending
            </Text>
            <Text style={[styles.previewAmountBold, { color: theme.veloBlue }]}>
              ₹{available.toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

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
            <Step2Income sources={sources} setSources={setSources} />
          )}
          {step === 3 && <Step3Cards cards={cards} setCards={setCards} />}
          {step === 4 && (
            <Step4Savings
              savingsGoal={savingsGoalStr}
              setSavingsGoal={setSavingsGoalStr}
              totalIncome={totalIncome}
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
