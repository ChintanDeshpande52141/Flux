import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/shared/theme";
import { useAiSuggestions } from "../hooks/useAiSuggestions";

export const AiSuggestions = () => {
  const { loading } = useAiSuggestions();

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>AI Suggestions coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  placeholder: { fontSize: 14, fontFamily: "Inter-Regular", color: Colors.gray },
});
