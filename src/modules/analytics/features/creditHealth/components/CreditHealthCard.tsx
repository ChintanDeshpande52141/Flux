import { Card, SkeletonBlock, SkeletonCard } from "@/shared/components";
import { useTheme } from "@/shared/theme";
import { ShieldOff } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCreditHealth } from "../hooks/useCreditHealth";

const STATUS_COLORS: Record<string, string> = {
  excellent: "#10B981",
  good: "#00BAE5",
  fair: "#F59E0B",
  poor: "#EF4444",
};

export const CreditHealthCard = () => {
  const theme = useTheme();
  const { data, loading } = useCreditHealth();

  if (loading)
    return (
      <SkeletonCard>
        <SkeletonBlock height={12} width="40%" />
        <SkeletonBlock height={40} width="30%" />
        <SkeletonBlock height={12} width="55%" />
      </SkeletonCard>
    );

  if (!data) {
    return (
      <Card padding={20}>
        <View style={styles.emptyRow}>
          <ShieldOff size={20} color={theme.subtext} />
          <View style={styles.emptyText}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Credit Health
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
              No credit score on record yet
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  const statusColor = STATUS_COLORS[data.status] ?? theme.subtext;

  return (
    <Card padding={20}>
      <Text style={[styles.label, { color: theme.subtext }]}>
        Credit Health
      </Text>
      <Text style={[styles.score, { color: theme.text }]}>{data.score}</Text>
      <Text style={[styles.status, { color: statusColor }]}>
        {data.status.toUpperCase()}
      </Text>
      <Text style={[styles.change, { color: theme.subtext }]}>
        {data.change >= 0 ? "▲" : "▼"} {Math.abs(data.change)} pts this month
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 13, fontFamily: "Inter-Regular", marginBottom: 8 },
  score: { fontSize: 40, fontFamily: "Inter-Black" },
  status: { fontSize: 12, fontFamily: "Inter-Bold", marginTop: 2 },
  change: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 4 },
  emptyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  emptyText: { flex: 1 },
  emptyTitle: { fontSize: 15, fontFamily: "Inter-Bold" },
  emptySubtitle: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 2 },
});
