import { useTheme } from "@/shared/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: any;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: variant === "primary" ? theme.veloBlue : theme.surface,
          opacity: isDisabled ? 0.4 : 1,
          borderColor: variant === "secondary" ? theme.border : undefined,
          borderWidth: variant === "secondary" ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : theme.veloBlue}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: variant === "primary" ? "#fff" : theme.veloBlue,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },
});
