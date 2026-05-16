import { useAuth, type SavingsGoal } from "@/shared/context/AuthContext";
import { useOnboarding } from "@/shared/context/OnboardingContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Edit2,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIORITY_COLORS: Record<SavingsGoal["priority"], string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export default function SavingsGoalsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, updateMeta } = useAuth();
  const { data: onboardingData, updateData } = useOnboarding();

  const monthlyTarget = onboardingData?.savingsGoal ?? 0;
  const storedGoals: SavingsGoal[] = user?.user_metadata?.savings_goals ?? [];

  const [goals, setGoals] = useState<SavingsGoal[]>(storedGoals);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetStr, setTargetStr] = useState(String(monthlyTarget));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    priority: "medium" as SavingsGoal["priority"],
  });

  useEffect(() => {
    setGoals(user?.user_metadata?.savings_goals ?? []);
  }, [user]);

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0);
  const overallPct =
    totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const openAdd = () => {
    setEditingGoal(null);
    setForm({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      priority: "medium",
    });
    setShowAddModal(true);
  };

  const openEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      deadline: goal.deadline,
      priority: goal.priority,
    });
    setShowAddModal(true);
  };

  const handleSaveGoal = async () => {
    if (!form.name.trim() || !form.targetAmount) {
      Alert.alert("Validation", "Goal name and target amount are required.");
      return;
    }
    const newGoal: SavingsGoal = {
      id: editingGoal?.id ?? Date.now().toString(),
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount) || 0,
      currentAmount: Number(form.currentAmount) || 0,
      deadline: form.deadline || "12 months",
      priority: form.priority,
    };
    const updated = editingGoal
      ? goals.map((g) => (g.id === editingGoal.id ? newGoal : g))
      : [...goals, newGoal];
    setGoals(updated);
    await updateMeta({ savings_goals: updated });
    setShowAddModal(false);
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert("Delete Goal", "Remove this savings goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = goals.filter((g) => g.id !== id);
          setGoals(updated);
          await updateMeta({ savings_goals: updated });
        },
      },
    ]);
  };

  const handleSaveTarget = async () => {
    const val = Number(targetStr) || 0;
    await updateData({ savingsGoal: val });
    setEditingTarget(false);
  };

  const monthsLeft = (deadline: string) => {
    const n = parseInt(deadline);
    return isNaN(n) ? deadline : `${n} months`;
  };

  const monthlyNeed = (goal: SavingsGoal) => {
    const months = parseInt(goal.deadline) || 12;
    const remaining = goal.targetAmount - goal.currentAmount;
    return Math.ceil(remaining / months);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Savings Goals
          </Text>
          <Text style={[styles.headerSub, { color: theme.subtext }]}>
            Track progress toward your financial targets
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.veloBlue }]}
          onPress={openAdd}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Monthly Target Hero */}
        <View style={[styles.heroCard, { backgroundColor: theme.veloBlue }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Monthly Savings Target</Text>
              {editingTarget ? (
                <View style={styles.targetEditRow}>
                  <Text style={styles.heroAmount}>₹</Text>
                  <TextInput
                    style={styles.targetInput}
                    value={targetStr}
                    onChangeText={setTargetStr}
                    keyboardType="numeric"
                    autoFocus
                    onBlur={handleSaveTarget}
                    onSubmitEditing={handleSaveTarget}
                  />
                </View>
              ) : (
                <View style={styles.targetRow}>
                  <Text style={styles.heroAmount}>
                    ₹{monthlyTarget.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setEditingTarget(true)}
                    style={styles.editBtn}
                  >
                    <Edit2 size={14} color="rgba(255,255,255,0.8)" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.heroSub}>
                Automatically deducted from your safe-to-spend amount
              </Text>
            </View>
            <View style={styles.heroBadge}>
              <Target size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Overall Progress */}
        {goals.length > 0 && (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.overallHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Overall Progress
              </Text>
              <Text style={[styles.overallPct, { color: theme.veloBlue }]}>
                {overallPct}%
              </Text>
            </View>
            <Text style={[styles.overallAmounts, { color: theme.subtext }]}>
              ₹{totalCurrent.toLocaleString()} of ₹
              {totalTarget.toLocaleString()}
            </Text>
            <View
              style={[styles.progressBg, { backgroundColor: theme.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.veloBlue,
                    width: `${Math.min(overallPct, 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Goals List */}
        {goals.map((goal) => {
          const pct =
            goal.targetAmount > 0
              ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
              : 0;
          const remaining = goal.targetAmount - goal.currentAmount;
          const mNeed = monthlyNeed(goal);
          const isOnTrack = monthlyTarget >= mNeed;

          return (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              activeOpacity={0.9}
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalNameRow}>
                  <Text style={[styles.goalName, { color: theme.text }]}>
                    {goal.name}
                  </Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor: PRIORITY_COLORS[goal.priority] + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: PRIORITY_COLORS[goal.priority] },
                      ]}
                    >
                      {goal.priority}
                    </Text>
                  </View>
                </View>
                <View style={styles.goalRightRow}>
                  <Text
                    style={[
                      styles.goalPct,
                      { color: pct >= 80 ? theme.success : theme.veloBlue },
                    ]}
                  >
                    {pct}%
                  </Text>
                  <TouchableOpacity onPress={() => openEdit(goal)} hitSlop={8}>
                    <Edit2 size={14} color={theme.subtext} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id)}
                    hitSlop={8}
                  >
                    <Trash2 size={14} color={theme.danger} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.goalAmounts, { color: theme.subtext }]}>
                ₹{goal.currentAmount.toLocaleString()} / ₹
                {goal.targetAmount.toLocaleString()}
              </Text>
              <View
                style={[styles.progressBg, { backgroundColor: theme.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor:
                        pct >= 80
                          ? theme.success
                          : pct >= 50
                            ? theme.veloBlue
                            : theme.warning,
                      width: `${Math.min(pct, 100)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.goalStats}>
                <View style={styles.goalStat}>
                  <Text
                    style={[styles.goalStatLabel, { color: theme.subtext }]}
                  >
                    Remaining
                  </Text>
                  <Text style={[styles.goalStatValue, { color: theme.text }]}>
                    ₹{remaining.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.goalStat}>
                  <Text
                    style={[styles.goalStatLabel, { color: theme.subtext }]}
                  >
                    Deadline
                  </Text>
                  <Text style={[styles.goalStatValue, { color: theme.text }]}>
                    {monthsLeft(goal.deadline)}
                  </Text>
                </View>
                <View style={styles.goalStat}>
                  <Text
                    style={[styles.goalStatLabel, { color: theme.subtext }]}
                  >
                    Monthly Need
                  </Text>
                  <Text style={[styles.goalStatValue, { color: theme.text }]}>
                    ₹{mNeed.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.insightStrip,
                  { backgroundColor: isOnTrack ? "#10B98115" : "#F59E0B15" },
                ]}
              >
                <TrendingUp
                  size={12}
                  color={isOnTrack ? theme.success : theme.warning}
                />
                <Text
                  style={[
                    styles.insightText,
                    { color: isOnTrack ? theme.success : theme.warning },
                  ]}
                >
                  {isOnTrack
                    ? `On track! Your ₹${monthlyTarget.toLocaleString()}/month covers this goal with ₹${(monthlyTarget - mNeed).toLocaleString()} to spare.`
                    : `Need ₹${(mNeed - monthlyTarget).toLocaleString()} more per month to hit this goal on time.`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {goals.length === 0 && (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Target size={40} color={theme.subtextLight} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No goals yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
              Add savings goals like Emergency Fund, Vacation, or a new gadget!
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.veloBlue }]}
              onPress={openAdd}
            >
              <Text style={styles.emptyBtnText}>Add First Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Savings Tips */}
        <View
          style={[
            styles.tipsCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.tipsTitle, { color: theme.text }]}>
            Savings Tips
          </Text>
          {[
            "Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
            "Automate savings on your salary date before spending",
            "Build an emergency fund of 3–6 months expenses first",
          ].map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <View
                style={[styles.tipDot, { backgroundColor: theme.veloBlue }]}
              />
              <Text style={[styles.tipText, { color: theme.subtext }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.background,
                borderTopColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: theme.border }]}
            >
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingGoal ? "Edit Goal" : "New Savings Goal"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                hitSlop={8}
              >
                <Text style={[styles.modalClose, { color: theme.subtext }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              {[
                {
                  label: "Goal Name",
                  key: "name",
                  placeholder: "e.g. Emergency Fund",
                  keyboard: "default",
                },
                {
                  label: "Target Amount (₹)",
                  key: "targetAmount",
                  placeholder: "e.g. 300000",
                  keyboard: "numeric",
                },
                {
                  label: "Current Savings (₹)",
                  key: "currentAmount",
                  placeholder: "e.g. 50000",
                  keyboard: "numeric",
                },
                {
                  label: "Deadline (months)",
                  key: "deadline",
                  placeholder: "e.g. 12",
                  keyboard: "numeric",
                },
              ].map(({ label, key, placeholder, keyboard }) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                    {label}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={(form as any)[key]}
                    onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                    placeholder={placeholder}
                    placeholderTextColor={theme.subtextLight}
                    keyboardType={keyboard as any}
                  />
                </View>
              ))}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                  Priority
                </Text>
                <View style={styles.priorityRow}>
                  {(["high", "medium", "low"] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityOption,
                        {
                          backgroundColor:
                            form.priority === p
                              ? PRIORITY_COLORS[p]
                              : theme.surfaceVariant,
                          borderColor:
                            form.priority === p
                              ? PRIORITY_COLORS[p]
                              : theme.border,
                        },
                      ]}
                      onPress={() => setForm((f) => ({ ...f, priority: p }))}
                    >
                      <Text
                        style={[
                          styles.priorityOptionText,
                          {
                            color: form.priority === p ? "#FFF" : theme.subtext,
                          },
                        ]}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View
              style={[styles.modalFooter, { borderTopColor: theme.border }]}
            >
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text
                  style={[styles.modalCancelText, { color: theme.subtext }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  { backgroundColor: theme.veloBlue },
                ]}
                onPress={handleSaveGoal}
              >
                <Text style={styles.modalSaveText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontFamily: "Inter-Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { fontSize: 12, fontFamily: "Inter-Bold", color: "#FFFFFF" },
  content: { padding: 20, gap: 16, paddingBottom: 32 },

  heroCard: { borderRadius: 20, padding: 20 },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 6,
  },
  heroAmount: { fontSize: 34, fontFamily: "Inter-Black", color: "#FFFFFF" },
  targetRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  targetEditRow: { flexDirection: "row", alignItems: "center" },
  targetInput: {
    fontSize: 34,
    fontFamily: "Inter-Black",
    color: "#FFFFFF",
    minWidth: 120,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.5)",
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroSub: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  heroBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter-Bold" },
  overallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  overallPct: { fontSize: 20, fontFamily: "Inter-Black" },
  overallAmounts: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    marginBottom: 10,
  },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },

  goalCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 10,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  goalNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  goalName: { fontSize: 16, fontFamily: "Inter-Bold" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  priorityText: { fontSize: 11, fontFamily: "Inter-Bold" },
  goalRightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  goalPct: { fontSize: 18, fontFamily: "Inter-Black" },
  goalAmounts: { fontSize: 13, fontFamily: "Inter-Regular" },
  goalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  goalStat: { gap: 2 },
  goalStatLabel: { fontSize: 11, fontFamily: "Inter-Regular" },
  goalStatValue: { fontSize: 13, fontFamily: "Inter-Bold" },
  insightStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 10,
    borderRadius: 10,
  },
  insightText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    flex: 1,
    lineHeight: 17,
  },

  emptyState: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter-Bold", marginTop: 8 },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter-Bold", color: "#FFFFFF" },

  tipsCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 10,
  },
  tipsTitle: { fontSize: 16, fontFamily: "Inter-Bold", marginBottom: 4 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  tipText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    flex: 1,
    lineHeight: 19,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter-Bold" },
  modalClose: { fontSize: 22, fontWeight: "300" },
  modalBody: { paddingHorizontal: 20, paddingTop: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontFamily: "Inter-Bold", marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    borderWidth: StyleSheet.hairlineWidth,
  },
  priorityRow: { flexDirection: "row", gap: 8 },
  priorityOption: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  priorityOptionText: { fontSize: 13, fontFamily: "Inter-Bold" },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: { fontSize: 14, fontFamily: "Inter-Bold" },
  modalSaveBtn: {
    flex: 2,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSaveText: { fontSize: 14, fontFamily: "Inter-Bold", color: "#FFFFFF" },
});
