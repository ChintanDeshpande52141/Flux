import { Button, DatePicker } from "@/shared/components";
import { apiPatch, apiPost } from "@/shared/services/apiClient";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Subscription } from "../types";

const CATEGORIES = [
  "Entertainment",
  "Lifestyle & Core",
  "Utilities",
  "Transportation",
  "Insurance",
  "Other",
] as const;

const LOGO_COLORS = [
  "#00BAE5",
  "#6C63FF",
  "#FF6B6B",
  "#FFB347",
  "#4CAF50",
  "#F06292",
  "#26C6DA",
  "#AB47BC",
];

function pickColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type BillingCycle = "monthly" | "yearly";
type PaymentType = "UPI" | "Cash" | "Credit" | "Debit";

const PAYMENT_TYPES: PaymentType[] = ["UPI", "Cash", "Credit", "Debit"];

type Props = {
  visible: boolean;
  onClose: () => void;
  subscription?: Subscription;
};

export function AddFixedBillModal({ visible, onClose, subscription }: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [name, setName] = useState(subscription?.name ?? "");
  const [amount, setAmount] = useState(subscription?.amount.toString() ?? "");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    subscription?.billingCycle ?? "monthly",
  );
  const [category, setCategory] = useState<string>(
    subscription?.category ?? "Entertainment",
  );
  const [nextDueDate, setNextDueDate] = useState(
    subscription?.nextBillingDate?.slice(0, 10) ?? todayISO(),
  );
  const [paymentType, setPaymentType] = useState<PaymentType>(
    (subscription?.paymentType as PaymentType) ?? "UPI",
  );
  const [paymentMode, setPaymentMode] = useState<"Auto" | "Manual">(
    (subscription?.badge as "Auto" | "Manual") ?? "Manual",
  );
  const [notes, setNotes] = useState(subscription?.subtitle ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    name.trim().length > 0 &&
    parseFloat(amount) > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(nextDueDate);

  const reset = () => {
    setName("");
    setAmount("");
    setBillingCycle("monthly");
    setCategory("Entertainment");
    setNextDueDate(todayISO());
    setPaymentType("UPI");
    setPaymentMode("Manual");
    setNotes("");
    setError(null);
  };

  // Reset form when modal opens with different subscription
  useEffect(() => {
    if (visible && subscription) {
      setName(subscription.name);
      setAmount(subscription.amount.toString());
      setBillingCycle(subscription.billingCycle);
      setCategory(subscription.category);
      setNextDueDate(subscription.nextBillingDate?.slice(0, 10));
      setPaymentType((subscription.paymentType as PaymentType) ?? "UPI");
      setPaymentMode((subscription.badge as "Auto" | "Manual") ?? "Manual");
      setNotes(subscription.subtitle ?? "");
    } else if (visible) {
      reset();
    }
  }, [visible, subscription]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        subtitle: notes.trim() || undefined,
        amount: parseFloat(amount),
        billingCycle,
        nextBillingDate: nextDueDate,
        category,
        badge: paymentMode,
        paymentType,
        logoInitial: name.trim()[0]?.toUpperCase() ?? "?",
        logoColor: pickColor(name.trim()),
      };

      if (subscription) {
        await apiPatch(`/subscriptions/${subscription.id}`, payload);
      } else {
        await apiPost("/subscriptions", payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      await queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
      handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cycleOptions: { label: string; value: BillingCycle }[] = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

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
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                {subscription ? "Edit Fixed Bill" : "Add Fixed Bill"}
              </Text>
              <Text style={[styles.subtitle, { color: theme.subtext }]}>
                {subscription
                  ? "Update your recurring expense"
                  : "Track a new recurring expense"}
              </Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={theme.subtext} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.fieldsContainer}>
              {/* Bill Name */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Bill Name <Text style={{ color: theme.veloBlue }}>*</Text>
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
                  placeholder="e.g., Netflix, Spotify, Gym Membership"
                  placeholderTextColor={theme.subtext}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Amount */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Amount <Text style={{ color: theme.veloBlue }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.amountRow,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.rupeePrefix, { color: theme.subtext }]}>
                    ₹
                  </Text>
                  <TextInput
                    style={[styles.amountInput, { color: theme.text }]}
                    placeholder="0"
                    placeholderTextColor={theme.subtext}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
              </View>

              {/* Frequency */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Frequency
                </Text>
                <View
                  style={[
                    styles.segmented,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  {cycleOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.segmentBtn,
                        billingCycle === opt.value && {
                          backgroundColor: theme.veloBlue,
                        },
                      ]}
                      onPress={() => setBillingCycle(opt.value)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color:
                              billingCycle === opt.value
                                ? "#fff"
                                : theme.subtext,
                            fontFamily:
                              billingCycle === opt.value
                                ? "Inter-Bold"
                                : "Inter-Regular",
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Category <Text style={{ color: theme.veloBlue }}>*</Text>
                </Text>
                <View style={styles.chipGrid}>
                  {CATEGORIES.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            category === c
                              ? theme.veloBlue + "20"
                              : theme.background,
                          borderColor:
                            category === c ? theme.veloBlue : theme.border,
                        },
                      ]}
                      onPress={() => setCategory(c)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color:
                              category === c ? theme.veloBlue : theme.subtext,
                            fontFamily:
                              category === c ? "Inter-Bold" : "Inter-Regular",
                          },
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Next Due Date */}
              <View style={styles.field}>
                <DatePicker
                  label="Next Due Date"
                  value={nextDueDate}
                  onChange={setNextDueDate}
                  placeholder="Select date"
                />
              </View>

              {/* Payment Type */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Payment Type
                </Text>
                <View style={styles.chipGrid}>
                  {PAYMENT_TYPES.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            paymentType === p
                              ? theme.veloBlue + "20"
                              : theme.background,
                          borderColor:
                            paymentType === p ? theme.veloBlue : theme.border,
                        },
                      ]}
                      onPress={() => setPaymentType(p)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color:
                              paymentType === p
                                ? theme.veloBlue
                                : theme.subtext,
                            fontFamily:
                              paymentType === p
                                ? "Inter-Bold"
                                : "Inter-Regular",
                          },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Payment Mode */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Payment Mode
                </Text>
                <View
                  style={[
                    styles.segmented,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  {(["Auto", "Manual"] as const).map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.segmentBtn,
                        paymentMode === m && {
                          backgroundColor: theme.veloBlue,
                        },
                      ]}
                      onPress={() => setPaymentMode(m)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color: paymentMode === m ? "#fff" : theme.subtext,
                            fontFamily:
                              paymentMode === m
                                ? "Inter-Bold"
                                : "Inter-Regular",
                          },
                        ]}
                      >
                        {m === "Auto" ? "Auto-debit" : "Manual"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Notes (Optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.notesInput,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Add any additional details..."
                  placeholderTextColor={theme.subtext}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                />
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
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button
              title={subscription ? "Update Bill" : "Save Bill"}
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
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 18, fontFamily: "Inter-Bold", marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: "Inter-Regular" },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  field: {},
  fieldsContainer: { flexDirection: "column", gap: 22 },
  label: { fontSize: 13, fontFamily: "Inter-Bold", marginBottom: 8 },
  input: {
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
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  rupeePrefix: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    height: "100%",
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentText: { fontSize: 13 },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
  notesInput: {
    height: 90,
    paddingTop: 12,
    paddingBottom: 12,
  },
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
