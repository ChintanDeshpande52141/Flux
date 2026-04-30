import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/shared/theme";

type BaseProps = {
  icon: React.ReactNode;
  label: string;
};

type ChevronRow = BaseProps & {
  type: "chevron";
  onPress: () => void;
};

type ToggleRow = BaseProps & {
  type: "toggle";
  value: boolean;
  onToggle: (v: boolean) => void;
};

type Props = ChevronRow | ToggleRow;

export const SettingsRow = (props: Props) => {
  const theme = useTheme();

  const inner = (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: theme.surfaceVariant }]}>
          {props.icon}
        </View>
        <Text style={[styles.label, { color: theme.text }]}>{props.label}</Text>
      </View>
      {props.type === "chevron" ? (
        <ChevronRight size={16} color={theme.subtextLight} />
      ) : (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ true: theme.veloBlue, false: theme.border }}
          thumbColor="#FFFFFF"
        />
      )}
    </View>
  );

  if (props.type === "chevron") {
    return (
      <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 15, fontFamily: "Inter-Regular" },
});
