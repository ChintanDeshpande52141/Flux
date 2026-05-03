import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  tabs: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export const MultiFilterTabs = ({ tabs, selected, onChange }: Props) => {
  const theme = useTheme();

  const handlePress = (tab: string) => {
    if (tab === "All") {
      onChange(["All"]);
      return;
    }
    const withoutAll = selected.filter((s) => s !== "All");
    const isActive = withoutAll.includes(tab);
    const next = isActive
      ? withoutAll.filter((s) => s !== tab)
      : [...withoutAll, tab];
    onChange(next.length === 0 ? ["All"] : next);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {tabs.map((tab) => {
        const isActive = selected.includes(tab);
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => handlePress(tab)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive
                  ? theme.veloBlue
                  : theme.surfaceVariant,
                borderWidth: isActive ? 0 : StyleSheet.hairlineWidth,
                borderColor: theme.border,
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
