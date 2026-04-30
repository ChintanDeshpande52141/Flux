import { useTheme } from "@/shared/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  amount: string;
  color?: string;
  rightPill?: { label: string; onPress?: () => void };
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
};

export const MetricCard = ({
  label,
  amount,
  color,
  rightPill,
  rightIcon,
  children,
}: Props) => {
  const theme = useTheme();
  const bg = color ?? theme.veloBlue;

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {rightPill && (
          <TouchableOpacity
            style={styles.pill}
            onPress={rightPill.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.pillText}>{rightPill.label}</Text>
          </TouchableOpacity>
        )}
        {!rightPill && rightIcon && <View>{rightIcon}</View>}
      </View>

      <Text style={styles.amount}>{amount}</Text>

      {children && (
        <View
          style={[
            styles.childrenWrap,
            { borderTopColor: "rgba(255,255,255,0.2)" },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.8,
  },
  amount: {
    fontSize: 40,
    fontFamily: "Inter-Black",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: { fontSize: 12, fontFamily: "Inter-Bold", color: "#FFFFFF" },
  childrenWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
