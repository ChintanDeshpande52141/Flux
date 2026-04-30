import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/shared/theme";

type Props = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
};

export const AppHeader = ({ title, subtitle, rightElement }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.subtext }]}>{subtitle}</Text>
          )}
        </View>
        {rightElement ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 20, fontFamily: "Inter-Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter-Regular", marginTop: 1 },
  placeholder: { width: 36 },
});
