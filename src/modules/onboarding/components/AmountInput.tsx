import { useTheme } from "@/shared/theme";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export const AmountInput = ({ value, onChangeText, placeholder = "0" }: Props) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.amountRow,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <TextInput
        style={[styles.rupee, { color: theme.subtext }]}
        value="₹"
        editable={false}
      />
      <TextInput
        style={[styles.amountInput, { color: theme.text }]}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        placeholderTextColor={theme.subtextLight}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  rupee: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
});
