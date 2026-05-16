import {
  useOnboarding,
  type IncomeSource,
} from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

export default function IncomeSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: onboardingData, updateData } = useOnboarding();

  const [sources, setSources] = useState<IncomeSource[]>(
    onboardingData?.incomeSources?.length
      ? onboardingData.incomeSources
      : [{ name: "", amount: 0 }]
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (onboardingData?.incomeSources?.length) {
      setSources(onboardingData.incomeSources);
    }
  }, [onboardingData]);

  const original = JSON.stringify(onboardingData?.incomeSources ?? []);
  const hasChanges = JSON.stringify(sources) !== original;

  const totalIncome = sources.reduce((s, x) => s + (Number(x.amount) || 0), 0);

  const update = (i: number, field: keyof IncomeSource, val: string) => {
    const next = [...sources];
    if (field === "amount") next[i] = { ...next[i], amount: Number(val) || 0 };
    else next[i] = { ...next[i], name: val };
    setSources(next);
  };

  const handleSave = async () => {
    const valid = sources.filter((s) => s.amount > 0);
    if (valid.length === 0) {
      Alert.alert("Validation", "Add at least one income source.");
      return;
    }
    setSaving(true);
    try {
      await updateData({ incomeSources: valid, totalIncome });
      queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save income sources.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Income & Earnings</Text>
          <Text style={[styles.headerSub, { color: theme.subtext }]}>Monthly income sources</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {sources.map((src, i) => (
            <View
              key={i}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardLabel, { color: theme.subtext }]}>
                  Income Source {i + 1}
                </Text>
                {sources.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setSources(sources.filter((_, idx) => idx !== i))}
                    hitSlop={8}
                  >
                    <Trash2 size={16} color={theme.danger} />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                value={src.name}
                onChangeText={(v) => update(i, "name", v)}
                placeholder="e.g. Salary, Freelance"
                placeholderTextColor={theme.subtextLight}
              />
              <View style={[styles.amountRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={[styles.rupee, { color: theme.subtext }]}>₹</Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.text }]}
                  value={src.amount > 0 ? String(src.amount) : ""}
                  onChangeText={(v) => update(i, "amount", v.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  placeholderTextColor={theme.subtextLight}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.border }]}
            onPress={() => setSources([...sources, { name: "", amount: 0 }])}
          >
            <Plus size={16} color={theme.veloBlue} />
            <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>Add Income Source</Text>
          </TouchableOpacity>

          <View style={[styles.totalCard, { backgroundColor: theme.veloBlueDim, borderColor: theme.veloBlue }]}>
            <Text style={[styles.totalLabel, { color: theme.veloBlue }]}>Total Monthly Income</Text>
            <Text style={[styles.totalAmount, { color: theme.veloBlue }]}>
              ₹{totalIncome.toLocaleString()}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.discardBtn, { borderColor: theme.border }]}
          onPress={() => router.back()}
          disabled={!hasChanges}
          activeOpacity={0.7}
        >
          <Text style={[styles.discardText, { color: hasChanges ? theme.subtext : theme.subtextLight }]}>
            Discard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.veloBlue, opacity: (!hasChanges || saving) ? 0.4 : 1 }]}
          onPress={handleSave}
          disabled={!hasChanges || saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Changes"}</Text>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontFamily: "Inter-Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 2 },
  content: { padding: 20, gap: 16, paddingBottom: 24 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 13, fontFamily: "Inter-Bold" },
  nameInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  rupee: { fontSize: 18, fontFamily: "Inter-Bold", marginRight: 4 },
  amountInput: { flex: 1, fontSize: 20, fontFamily: "Inter-Bold" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addBtnText: { fontSize: 14, fontFamily: "Inter-Bold" },
  totalCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 14, fontFamily: "Inter-Bold" },
  totalAmount: { fontSize: 22, fontFamily: "Inter-Black" },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  discardBtn: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  discardText: { fontSize: 14, fontFamily: "Inter-Bold" },
  saveBtn: { flex: 2, height: 50, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  saveBtnText: { fontSize: 14, fontFamily: "Inter-Bold", color: "#FFFFFF" },
});
