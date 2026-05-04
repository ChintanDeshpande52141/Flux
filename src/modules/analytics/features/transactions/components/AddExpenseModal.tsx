import { Button } from "@/shared/components";
import { apiPost } from "@/shared/services/apiClient";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Others",
] as const;

const PAYMENT_TYPES = ["UPI", "Cash", "Credit", "Debit"] as const;

type Category = (typeof CATEGORIES)[number];
type PaymentType = (typeof PAYMENT_TYPES)[number];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AddExpenseModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [paymentType, setPaymentType] = useState<PaymentType>("UPI");
  const [date, setDate] = useState(todayISO());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    merchant.trim().length > 0 &&
    parseFloat(amount) > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(date);

  const reset = () => {
    setMerchant("");
    setAmount("");
    setCategory("Food");
    setPaymentType("UPI");
    setDate(todayISO());
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await apiPost("/transactions", {
        merchant: merchant.trim(),
        amount: parseFloat(amount),
        category,
        paymentType,
        transactedAt: new Date(`${date}T12:00:00.000Z`).toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
      await queryClient.invalidateQueries({ queryKey: ["spending-pulse"] });
      await queryClient.invalidateQueries({ queryKey: ["spending-velocity"] });
      await queryClient.invalidateQueries({ queryKey: ["spending-analysis"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              Add Expense
            </Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={theme.subtext} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Merchant */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Merchant
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="e.g. Zomato, Uber"
                placeholderTextColor={theme.subtext}
                value={merchant}
                onChangeText={setMerchant}
              />
            </View>

            {/* Amount */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Amount (₹)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={theme.subtext}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Date */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Date (YYYY-MM-DD)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="2025-05-04"
                placeholderTextColor={theme.subtext}
                value={date}
                onChangeText={setDate}
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Category
              </Text>
              <View style={styles.chipRow}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          category === c ? theme.veloBlue : theme.background,
                        borderColor:
                          category === c ? theme.veloBlue : theme.border,
                      },
                    ]}
                    onPress={() => setCategory(c)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: category === c ? "#fff" : theme.subtext },
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Payment Type */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Payment Type
              </Text>
              <View style={styles.chipRow}>
                {PAYMENT_TYPES.map((p) => (
                  <Pressable
                    key={p}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          paymentType === p ? theme.veloBlue : theme.background,
                        borderColor:
                          paymentType === p ? theme.veloBlue : theme.border,
                      },
                    ]}
                    onPress={() => setPaymentType(p)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: paymentType === p ? "#fff" : theme.subtext },
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {error && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: "rgba(239,68,68,0.1)" },
                ]}
              >
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button
              title="Add Expense"
              onPress={handleSubmit}
              loading={loading}
              disabled={!isValid}
              style={styles.submitBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 17, fontFamily: "Inter-Bold" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontFamily: "Inter-Bold", marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: "Inter-Regular" },
  errorBox: { borderRadius: 10, padding: 12, marginBottom: 12 },
  errorText: { fontSize: 13, fontFamily: "Inter-Regular", color: "#EF4444" },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
