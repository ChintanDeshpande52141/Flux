import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/shared/theme";

type Props = { id: string };

export const SubscriptionDetail = ({ id }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Subscription Detail — {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholder: { fontSize: 16, fontFamily: "Inter-Regular", color: Colors.gray },
});
