import {
  useOnboarding,
  type CreditCard,
} from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft, CreditCard as CardIcon, Plus, Trash2 } from "lucide-react-native";
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

export default function CardsSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: onboardingData, updateData } = useOnboarding();

  const [cards, setCards] = useState<CreditCard[]>(
    onboardingData?.creditCards ?? []
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (onboardingData?.creditCards) {
      setCards(onboardingData.creditCards);
    }
  }, [onboardingData]);

  const original = JSON.stringify(onboardingData?.creditCards ?? []);
  const hasChanges = JSON.stringify(cards) !== original;

  const totalLimit = cards.reduce((s, c) => s + c.limit, 0);

  const update = (i: number, field: keyof CreditCard, val: string) => {
    const next = [...cards];
    if (field === "limit") {
      next[i] = { ...next[i], limit: Number(val) || 0, spendCap: Math.round((Number(val) || 0) * 0.3) };
    } else {
      next[i] = { ...next[i], [field]: val };
    }
    setCards(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateData({ creditCards: cards });
      queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save cards.");
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Credit Cards</Text>
          <Text style={[styles.headerSub, { color: theme.subtext }]}>Manage your credit cards</Text>
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
          {cards.map((card, i) => (
            <View
              key={i}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <CardIcon size={16} color={theme.veloBlue} />
                  <Text style={[styles.cardLabel, { color: theme.subtext }]}>Card {i + 1}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setCards(cards.filter((_, idx) => idx !== i))}
                  hitSlop={8}
                >
                  <Trash2 size={16} color={theme.danger} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                value={card.name}
                onChangeText={(v) => update(i, "name", v)}
                placeholder="e.g. HDFC Regalia, Axis Flipkart"
                placeholderTextColor={theme.subtextLight}
              />
              <View>
                <Text style={[styles.fieldLabel, { color: theme.subtext }]}>Credit Limit (₹)</Text>
                <View style={[styles.amountRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <Text style={[styles.rupee, { color: theme.subtext }]}>₹</Text>
                  <TextInput
                    style={[styles.amountInput, { color: theme.text }]}
                    value={card.limit > 0 ? String(card.limit) : ""}
                    onChangeText={(v) => update(i, "limit", v.replace(/[^0-9]/g, ""))}
                    placeholder="0"
                    placeholderTextColor={theme.subtextLight}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={[styles.spendCapNote, { color: theme.subtextLight }]}>
                  Spend cap: ₹{card.spendCap.toLocaleString()} (30% of limit)
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.border }]}
            onPress={() => setCards([...cards, { name: "", limit: 0, spendCap: 0 }])}
          >
            <Plus size={16} color={theme.veloBlue} />
            <Text style={[styles.addBtnText, { color: theme.veloBlue }]}>Add Credit Card</Text>
          </TouchableOpacity>

          {cards.length > 0 && (
            <View style={[styles.totalCard, { backgroundColor: theme.veloBlueDim, borderColor: theme.veloBlue }]}>
              <Text style={[styles.totalLabel, { color: theme.veloBlue }]}>Total Credit Limit</Text>
              <Text style={[styles.totalAmount, { color: theme.veloBlue }]}>
                ₹{totalLimit.toLocaleString()}
              </Text>
            </View>
          )}
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
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardLabel: { fontSize: 13, fontFamily: "Inter-Bold" },
  fieldLabel: { fontSize: 12, fontFamily: "Inter-Bold", marginBottom: 6 },
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
  spendCapNote: { fontSize: 11, fontFamily: "Inter-Regular", marginTop: 4 },
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
