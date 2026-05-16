import { useTheme } from "@/shared/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
  showSkip?: boolean;
  loading?: boolean;
};

export const NavBar = ({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  continueDisabled = false,
  showBack = true,
  showSkip = false,
  loading = false,
}: Props) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.navBar,
        { backgroundColor: theme.background, borderTopColor: theme.border },
      ]}
    >
      <View style={styles.navRow}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: theme.border }]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            {
              backgroundColor: theme.veloBlue,
              opacity: continueDisabled || loading ? 0.4 : 1,
            },
          ]}
          onPress={onContinue}
          disabled={continueDisabled || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>{continueLabel} ›</Text>
        </TouchableOpacity>
      </View>
      {showSkip && (
        <TouchableOpacity onPress={onSkip} hitSlop={8} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.subtext }]}>
            Skip this step
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  navRow: { flexDirection: "row", gap: 12 },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: 15, fontFamily: "Inter-Bold" },
  continueBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continueBtnText: { fontSize: 15, fontFamily: "Inter-Bold", color: "#FFFFFF" },
  skipBtn: { alignItems: "center" },
  skipText: { fontSize: 13, fontFamily: "Inter-Regular" },
});
