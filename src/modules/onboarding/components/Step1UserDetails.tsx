import { useTheme } from "@/shared/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const COUNTRIES = [
  { name: "India", currency: "INR" },
  { name: "United States", currency: "USD" },
  { name: "United Kingdom", currency: "GBP" },
  { name: "Canada", currency: "CAD" },
  { name: "Australia", currency: "AUD" },
  { name: "Germany", currency: "EUR" },
  { name: "France", currency: "EUR" },
  { name: "Japan", currency: "JPY" },
  { name: "Singapore", currency: "SGD" },
  { name: "UAE", currency: "AED" },
] as const;

type Props = {
  fullName: string;
  setFullName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  profession: string;
  setProfession: (v: string) => void;
};

export const Step1UserDetails = ({
  fullName,
  setFullName,
  age,
  setAge,
  country,
  setCountry,
  profession,
  setProfession,
}: Props) => {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.stepTitle, { color: theme.text }]}>
        Let's get to know you
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext }]}>
        Tell us a bit about yourself so we can personalize your experience.
      </Text>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Full Name *
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={theme.subtextLight}
        />
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Age
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={age}
          onChangeText={setAge}
          placeholder="Your age"
          placeholderTextColor={theme.subtextLight}
          keyboardType="numeric"
        />
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Country *
        </Text>
        <View
          style={[
            styles.nameInput,
            {
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={{ color: theme.text }}>
            {country || "Select your country"}
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: theme.veloBlue }}>Change</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[
                styles.quickChip,
                {
                  borderColor:
                    country === c.name ? theme.veloBlue : theme.border,
                  backgroundColor:
                    country === c.name
                      ? theme.veloBlueDim
                      : theme.surfaceVariant,
                },
              ]}
              onPress={() => setCountry(c.name)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickChipText,
                  {
                    color: country === c.name ? theme.veloBlue : theme.subtext,
                  },
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.sourceCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardFieldLabel, { color: theme.subtext }]}>
          Profession
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.surfaceVariant,
            },
          ]}
          value={profession}
          onChangeText={setProfession}
          placeholder="e.g., Software Engineer, Student"
          placeholderTextColor={theme.subtextLight}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stepContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  sourceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  cardFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  nameInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  quickRow: { flexDirection: "row", gap: 8 },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipText: { fontSize: 13, fontFamily: "Inter-Bold" },
});
