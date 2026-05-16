import { SectionHeader } from "@/shared/components";
import { apiDelete } from "@/shared/services/apiClient";
import { useTheme } from "@/shared/theme";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubscriptionList } from "../hooks/useSubscriptionList";
import { Subscription, SubscriptionBadge } from "../types";

const BADGE_COLORS: Record<SubscriptionBadge, string> = {
  Auto: "#00BAE5",
  Fixed: "#6366F1",
  Elite: "#F59E0B",
  Manual: "#9CA3AF",
};

const PAYMENT_TYPE_COLORS: Record<"UPI" | "Cash" | "Credit" | "Debit", string> =
  {
    UPI: "#6366F1",
    Cash: "#10B981",
    Credit: "#F59E0B",
    Debit: "#00BAE5",
  };

const BillItem = ({
  item,
  onEdit,
  onDelete,
}: {
  item: Subscription;
  onEdit: (item: Subscription) => void;
  onDelete: (id: string) => void;
}) => {
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <View style={[styles.item, { borderBottomColor: theme.border }]}>
      <View style={[styles.logo, { backgroundColor: `${item.logoColor}20` }]}>
        <Text style={[styles.logoText, { color: item.logoColor }]}>
          {item.logoInitial}
        </Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemSub, { color: theme.subtext }]}>
          {item.subtitle}
        </Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemAmount, { color: theme.text }]}>
          ₹{item.amount.toLocaleString()}
        </Text>
        <View style={styles.badgeRow}>
          {item.paymentType && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: `${PAYMENT_TYPE_COLORS[item.paymentType]}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: PAYMENT_TYPE_COLORS[item.paymentType] },
                ]}
              >
                {item.paymentType}
              </Text>
            </View>
          )}
          {item.badge && (
            <View
              style={[
                styles.badge,
                { backgroundColor: `${BADGE_COLORS[item.badge]}20` },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: BADGE_COLORS[item.badge] }]}
              >
                {item.badge}
              </Text>
            </View>
          )}
          <Text style={[styles.cycle, { color: theme.subtextLight }]}>
            /{item.billingCycle === "monthly" ? "mo" : "yr"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={styles.menuBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MoreVertical size={16} color={theme.subtext} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={styles.confirmOverlay}
          onPress={() => setShowMenu(false)}
        >
          <Pressable
            style={[styles.confirmCard, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.confirmTitle, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.confirmMsg, { color: theme.subtext }]}>
              What would you like to do?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: "#00BAE515",
                    borderColor: "#00BAE530",
                    gap: 6,
                  },
                ]}
                onPress={() => {
                  setShowMenu(false);
                  onEdit(item);
                }}
              >
                <Pencil size={18} color="#00BAE5" />
                <Text style={[styles.confirmBtnText, { color: "#00BAE5" }]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: "#EF444415",
                    borderColor: "#EF444430",
                    gap: 6,
                  },
                ]}
                onPress={() => setShowConfirm(true)}
              >
                <Trash2 size={18} color="#EF4444" />
                <Text style={[styles.confirmBtnText, { color: "#EF4444" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <Pressable
          style={styles.confirmOverlay}
          onPress={() => setShowConfirm(false)}
        >
          <Pressable
            style={[styles.confirmCard, { backgroundColor: theme.surface }]}
          >
            <View
              style={[styles.confirmIconWrap, { backgroundColor: "#EF444415" }]}
            >
              <Trash2 size={22} color="#EF4444" />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>
              Delete Subscription
            </Text>
            <Text style={[styles.confirmMsg, { color: theme.subtext }]}>
              Remove "{item.name}" from your subscriptions? This cannot be
              undone.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={[styles.confirmBtnText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#EF4444" }]}
                disabled={deleting}
                onPress={async () => {
                  setDeleting(true);
                  await onDelete(item.id);
                  setDeleting(false);
                  setShowConfirm(false);
                }}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.confirmBtnText, { color: "#fff" }]}>
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const SubscriptionList = ({
  onEdit,
}: {
  onEdit?: (item: Subscription) => void;
}) => {
  const theme = useTheme();
  const { data, loading } = useSubscriptionList();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/subscriptions/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      await queryClient.invalidateQueries({ queryKey: ["safe-to-spend"] });
    } catch (e) {
      Alert.alert("Error", "Failed to delete subscription");
    }
  };

  if (loading || !data) return null;

  return (
    <View>
      {data.categories.map((cat) => (
        <View key={cat.label} style={styles.categoryBlock}>
          <TouchableOpacity
            style={[styles.categoryRow, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
          >
            <SectionHeader label={cat.label} />
          </TouchableOpacity>
          {cat.items.map((item) => (
            <BillItem
              key={item.id}
              item={item}
              onEdit={onEdit || (() => {})}
              onDelete={handleDelete}
            />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.addCta} activeOpacity={0.7}>
        <View style={[styles.addCircle, { borderColor: theme.border }]}>
          <Plus size={20} color={theme.subtextLight} />
        </View>
        <Text style={[styles.addText, { color: theme.subtext }]}>
          Missing an obligation?
        </Text>
        <Text style={[styles.addSub, { color: theme.subtextLight }]}>
          Add a recurring subscription or rent.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBlock: { marginBottom: 8 },
  categoryRow: { paddingVertical: 4 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 16, fontFamily: "Inter-Bold" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontFamily: "Inter-Bold", marginBottom: 2 },
  itemSub: { fontSize: 12, fontFamily: "Inter-Regular" },
  itemRight: { alignItems: "flex-end", gap: 4 },
  itemAmount: { fontSize: 14, fontFamily: "Inter-Bold" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontFamily: "Inter-Bold" },
  cycle: { fontSize: 11, fontFamily: "Inter-Regular" },
  addCta: { alignItems: "center", paddingVertical: 32, gap: 8 },
  addCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { fontSize: 14, fontFamily: "Inter-Bold" },
  addSub: { fontSize: 12, fontFamily: "Inter-Regular" },
  menuBtn: { padding: 8 },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  menuSheet: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
  },
  menuHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  menuAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuActionText: { fontSize: 15, fontFamily: "Inter-Bold" },
  menuCancel: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  menuCancelText: { fontSize: 15, fontFamily: "Inter-Regular" },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  confirmCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  confirmIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  confirmTitle: { fontSize: 17, fontFamily: "Inter-Bold", textAlign: "center" },
  confirmMsg: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  confirmBtnText: { fontSize: 15, fontFamily: "Inter-Bold" },
});
