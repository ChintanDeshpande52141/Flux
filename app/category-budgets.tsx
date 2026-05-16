import { useAuth, type CategoryBudget } from "@/shared/context/AuthContext";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Edit2,
  Plus,
  Trash2,
  TrendingUp,
  Zap,
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

const DEFAULT_CATEGORIES: CategoryBudget[] = [
  {
    id: "food",
    name: "Food & Dining",
    budgetLimit: 12000,
    spentAmount: 0,
    icon: "🍔",
    color: "#F59E0B",
  },
  {
    id: "transport",
    name: "Transportation",
    budgetLimit: 5000,
    spentAmount: 0,
    icon: "🚗",
    color: "#3B82F6",
  },
  {
    id: "shopping",
    name: "Shopping",
    budgetLimit: 8000,
    spentAmount: 0,
    icon: "🛍️",
    color: "#8B5CF6",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    budgetLimit: 4000,
    spentAmount: 0,
    icon: "🎬",
    color: "#EC4899",
  },
  {
    id: "health",
    name: "Health",
    budgetLimit: 3000,
    spentAmount: 0,
    icon: "💊",
    color: "#10B981",
  },
  {
    id: "others",
    name: "Others",
    budgetLimit: 5000,
    spentAmount: 0,
    icon: "📦",
    color: "#6B7280",
  },
];

const BUDGET_TIPS = [
  "Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
  "Review your category budgets monthly and adjust based on actuals",
  "Categories over 80% usage are a warning sign — tighten next month",
];

export default function CategoryBudgetsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, updateMeta } = useAuth();

  const stored: CategoryBudget[] = user?.user_metadata?.category_budgets ?? [];
  const [categories, setCategories] = useState<CategoryBudget[]>(
    stored.length > 0 ? stored : DEFAULT_CATEGORIES,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryBudget | null>(null);
  const [form, setForm] = useState({
    name: "",
    budgetLimit: "",
    icon: "📦",
    color: "#6B7280",
  });

  useEffect(() => {
    const s: CategoryBudget[] = user?.user_metadata?.category_budgets ?? [];
    if (s.length > 0) setCategories(s);
  }, [user]);

  const totalBudget = categories.reduce((s, c) => s + c.budgetLimit, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spentAmount, 0);
  const totalPct =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const remaining = totalBudget - totalSpent;

  const pctColor = (pct: number) => {
    if (pct >= 85) return theme.danger;
    if (pct >= 70) return theme.warning;
    return theme.success;
  };

  const openAdd = () => {
    setEditingCat(null);
    setForm({ name: "", budgetLimit: "", icon: "📦", color: "#6B7280" });
    setShowModal(true);
  };

  const openEdit = (cat: CategoryBudget) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      budgetLimit: String(cat.budgetLimit),
      icon: cat.icon,
      color: cat.color,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.budgetLimit) {
      Alert.alert("Validation", "Name and budget limit are required.");
      return;
    }
    const updated: CategoryBudget = {
      id: editingCat?.id ?? Date.now().toString(),
      name: form.name.trim(),
      budgetLimit: Number(form.budgetLimit) || 0,
      spentAmount: editingCat?.spentAmount ?? 0,
      icon: form.icon,
      color: form.color,
    };
    const newList = editingCat
      ? categories.map((c) => (c.id === editingCat.id ? updated : c))
      : [...categories, updated];
    setCategories(newList);
    await updateMeta({ category_budgets: newList });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Category", "Remove this budget category?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newList = categories.filter((c) => c.id !== id);
          setCategories(newList);
          await updateMeta({ category_budgets: newList });
        },
      },
    ]);
  };

  const ICON_OPTIONS = [
    "🍔",
    "🚗",
    "🛍️",
    "🎬",
    "💊",
    "📦",
    "✈️",
    "🏠",
    "📚",
    "💻",
    "👗",
    "🎮",
  ];
  const COLOR_OPTIONS = [
    "#F59E0B",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#6B7280",
    "#EF4444",
    "#00BAE5",
  ];

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
            Category Budgets
          </Text>
          <Text style={[styles.headerSub, { color: theme.subtext }]}>
            Set monthly spending limits per category
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.veloBlue }]}
          onPress={openAdd}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.veloBlue }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroMetaLabel}>Total Budget</Text>
              <Text style={styles.heroAmount}>
                ₹{totalBudget.toLocaleString()}
              </Text>
            </View>
            <View>
              <Text style={[styles.heroMetaLabel, { textAlign: "right" }]}>
                Spent
              </Text>
              <Text style={styles.heroSpent}>
                ₹{totalSpent.toLocaleString()}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.heroProgressBg,
              { backgroundColor: "rgba(255,255,255,0.3)" },
            ]}
          >
            <View
              style={[
                styles.heroProgressFill,
                {
                  backgroundColor: "#FFFFFF",
                  width: `${Math.min(totalPct, 100)}%`,
                },
              ]}
            />
          </View>
          <View style={styles.heroBottomRow}>
            <Text style={styles.heroSubLeft}>{totalPct}% used</Text>
            <Text style={styles.heroSubRight}>
              ₹{remaining.toLocaleString()} remaining
            </Text>
          </View>
        </View>

        {/* Categories */}
        {categories.map((cat) => {
          const pct =
            cat.budgetLimit > 0
              ? Math.round((cat.spentAmount / cat.budgetLimit) * 100)
              : 0;
          const rem = cat.budgetLimit - cat.spentAmount;
          const color = pctColor(pct);
          const showInsight = pct >= 50;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              activeOpacity={0.9}
            >
              <View style={styles.catHeader}>
                <View
                  style={[
                    styles.catIcon,
                    { backgroundColor: cat.color + "20" },
                  ]}
                >
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: theme.text }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.catAmounts, { color: theme.subtext }]}>
                    ₹{cat.spentAmount.toLocaleString()} of ₹
                    {cat.budgetLimit.toLocaleString()}
                  </Text>
                </View>
                <Text style={[styles.catPct, { color }]}>{pct}%</Text>
                <TouchableOpacity
                  onPress={() => openEdit(cat)}
                  hitSlop={8}
                  style={styles.editBtn}
                >
                  <Edit2 size={14} color={theme.subtext} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(cat.id)}
                  hitSlop={8}
                  style={styles.editBtn}
                >
                  <Trash2 size={14} color={theme.danger} />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.catProgressBg,
                  { backgroundColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.catProgressFill,
                    { backgroundColor: color, width: `${Math.min(pct, 100)}%` },
                  ]}
                />
              </View>
              {showInsight && (
                <View
                  style={[
                    styles.insightStrip,
                    { backgroundColor: color + "15" },
                  ]}
                >
                  <Zap size={12} color={color} />
                  <Text style={[styles.insightText, { color }]}>
                    {pct >= 100
                      ? `Budget exceeded by ₹${Math.abs(rem).toLocaleString()}!`
                      : `Getting close! ${pct}% spent with ₹${rem.toLocaleString()} remaining.`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Budget Tips */}
        <View
          style={[
            styles.tipsCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.tipsTitle, { color: theme.text }]}>
            Budget Tips
          </Text>
          {BUDGET_TIPS.map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <TrendingUp
                size={12}
                color={theme.veloBlue}
                style={{ marginTop: 3 }}
              />
              <Text style={[styles.tipText, { color: theme.subtext }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
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
                {editingCat ? "Edit Category" : "Add Category"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)} hitSlop={8}>
                <Text style={[styles.modalClose, { color: theme.subtext }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                  Category Name
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
                  value={form.name}
                  onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="e.g. Food & Dining"
                  placeholderTextColor={theme.subtextLight}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                  Monthly Budget (₹)
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
                  value={form.budgetLimit}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, budgetLimit: v }))
                  }
                  placeholder="e.g. 12000"
                  placeholderTextColor={theme.subtextLight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                  Icon
                </Text>
                <View style={styles.iconGrid}>
                  {ICON_OPTIONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor:
                            form.icon === icon
                              ? theme.veloBlueDim
                              : theme.surfaceVariant,
                          borderColor:
                            form.icon === icon ? theme.veloBlue : "transparent",
                        },
                      ]}
                      onPress={() => setForm((f) => ({ ...f, icon }))}
                    >
                      <Text style={styles.iconEmoji}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>
                  Color
                </Text>
                <View style={styles.colorRow}>
                  {COLOR_OPTIONS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorDot,
                        { backgroundColor: color },
                        form.color === color && styles.colorDotSelected,
                      ]}
                      onPress={() => setForm((f) => ({ ...f, color }))}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
            <View
              style={[styles.modalFooter, { borderTopColor: theme.border }]}
            >
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                onPress={() => setShowModal(false)}
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
                onPress={handleSave}
              >
                <Text style={styles.modalSaveText}>Save</Text>
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
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  heroMetaLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  heroAmount: { fontSize: 32, fontFamily: "Inter-Black", color: "#FFFFFF" },
  heroSpent: { fontSize: 24, fontFamily: "Inter-Black", color: "#FFFFFF" },
  heroProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  heroProgressFill: { height: "100%", borderRadius: 4 },
  heroBottomRow: { flexDirection: "row", justifyContent: "space-between" },
  heroSubLeft: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    color: "rgba(255,255,255,0.85)",
  },
  heroSubRight: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    color: "rgba(255,255,255,0.85)",
  },

  catCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  catHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  catEmoji: { fontSize: 22 },
  catInfo: { flex: 1 },
  catName: { fontSize: 15, fontFamily: "Inter-Bold" },
  catAmounts: { fontSize: 12, fontFamily: "Inter-Regular", marginTop: 2 },
  catPct: { fontSize: 18, fontFamily: "Inter-Black" },
  editBtn: { padding: 4 },
  catProgressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  catProgressFill: { height: "100%", borderRadius: 3 },
  insightStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    padding: 8,
    borderRadius: 8,
  },
  insightText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    flex: 1,
    lineHeight: 17,
  },

  tipsCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 10,
  },
  tipsTitle: { fontSize: 16, fontFamily: "Inter-Bold", marginBottom: 4 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    flex: 1,
    lineHeight: 19,
  },

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
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  iconEmoji: { fontSize: 20 },
  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
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
