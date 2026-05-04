import { useTheme } from "@/shared/theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.veloBlue} />
        <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
});
