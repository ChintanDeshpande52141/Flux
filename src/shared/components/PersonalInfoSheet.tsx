import { Step1UserDetails } from "@/modules/onboarding/components";
import { useAuth } from "@/shared/context/AuthContext";
import { useTheme } from "@/shared/theme";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    fullName: string;
    age: string;
    country: string;
    profession: string;
  }) => Promise<void>;
};

export const PersonalInfoSheet = ({ visible, onClose, onSave }: Props) => {
  const theme = useTheme();
  const { user } = useAuth();
  const metadata = user?.user_metadata || {};

  const [fullName, setFullName] = useState(metadata.full_name || "");
  const [age, setAge] = useState(metadata.age ? String(metadata.age) : "");
  const [country, setCountry] = useState(metadata.country || "");
  const [profession, setProfession] = useState(metadata.profession || "");
  const [saving, setSaving] = useState(false);

  // Store original values for dirty check and discard
  const originalData = {
    fullName: metadata.full_name || "",
    age: metadata.age ? String(metadata.age) : "",
    country: metadata.country || "",
    profession: metadata.profession || "",
  };

  const hasChanges =
    fullName !== originalData.fullName ||
    age !== originalData.age ||
    country !== originalData.country ||
    profession !== originalData.profession;

  const handleDiscard = () => {
    setFullName(originalData.fullName);
    setAge(originalData.age);
    setCountry(originalData.country);
    setProfession(originalData.profession);
    onClose();
  };

  const handleSave = async () => {
    if (fullName.trim().length === 0 || country.length === 0) {
      Alert.alert("Validation Error", "Full Name and Country are required.");
      return;
    }

    setSaving(true);
    try {
      await onSave({ fullName, age, country, profession });
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setFullName(metadata.full_name || "");
      setAge(metadata.age ? String(metadata.age) : "");
      setCountry(metadata.country || "");
      setProfession(metadata.profession || "");
    }
  }, [visible, metadata]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.background, borderTopColor: theme.border },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Edit Personal Information
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text style={[styles.closeText, { color: theme.subtext }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Step1UserDetails
              fullName={fullName}
              setFullName={setFullName}
              age={age}
              setAge={setAge}
              country={country}
              setCountry={setCountry}
              profession={profession}
              setProfession={setProfession}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.discardBtn, { borderColor: theme.border }]}
              onPress={handleDiscard}
              disabled={!hasChanges}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.discardBtnText,
                  { color: hasChanges ? theme.subtext : theme.subtextLight },
                ]}
              >
                Discard Changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: theme.veloBlue,
                  opacity: !hasChanges || saving ? 0.4 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={!hasChanges || saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
  closeText: {
    fontSize: 24,
    fontWeight: "300",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  discardBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  discardBtnText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },
  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
  },
});
