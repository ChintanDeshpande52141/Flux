import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/shared/theme";
import { useMessageFeed } from "../hooks/useMessageFeed";

export const MessageFeed = () => {
  const { loading } = useMessageFeed();

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Chat Feed coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholder: { fontSize: 16, fontFamily: "Inter-Regular", color: Colors.gray },
});
