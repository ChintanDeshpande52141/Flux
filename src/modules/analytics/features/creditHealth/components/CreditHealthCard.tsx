import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/shared/theme";
import { useCreditHealth } from "../hooks/useCreditHealth";

export const CreditHealthCard = () => {
  const { data, loading } = useCreditHealth();

  if (loading || !data) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Credit Health</Text>
      <Text style={styles.score}>{data.score}</Text>
      <Text style={styles.status}>{data.status.toUpperCase()}</Text>
      <Text style={styles.change}>
        {data.change >= 0 ? "▲" : "▼"} {Math.abs(data.change)} pts this month
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: { fontSize: 13, fontFamily: "Inter-Regular", color: Colors.gray, marginBottom: 8 },
  score: { fontSize: 40, fontFamily: "Inter-Black", color: Colors.dark },
  status: { fontSize: 12, fontFamily: "Inter-Bold", color: Colors.success, marginTop: 2 },
  change: { fontSize: 13, fontFamily: "Inter-Regular", color: Colors.gray, marginTop: 4 },
});
