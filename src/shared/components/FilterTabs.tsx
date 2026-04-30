import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export const FilterTabs = ({ tabs, active, onChange }: Props) => {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? theme.veloBlue : theme.surfaceVariant,
              },
            ]}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? "#FFFFFF" : theme.subtext },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: { fontSize: 13, fontFamily: "Inter-Bold" },
});
