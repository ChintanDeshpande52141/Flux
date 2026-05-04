import { Button } from "@/shared/components";
import { useAuth } from "@/shared/context/AuthContext";
import { supabase } from "@/shared/services/supabaseClient";
import { useTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const FRIENDLY_ERRORS: Record<string, string> = {
  "User already registered":
    "An account with this email already exists. Sign in instead.",
  "user already registered":
    "An account with this email already exists. Sign in instead.",
  "Invalid login credentials": "Incorrect email or password.",
  "Email not confirmed": "Please confirm your email before signing in.",
};

function friendlyError(msg: string): string {
  for (const [key, val] of Object.entries(FRIENDLY_ERRORS)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return msg;
}

type Mode = "signin" | "signup" | "forgot";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp, session } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError =
    touched.email && !isValidEmail(email) ? "Enter a valid email" : null;
  const passwordError =
    touched.password && password.length < 6 ? "Min 6 characters" : null;
  const isValid =
    mode === "forgot"
      ? isValidEmail(email)
      : isValidEmail(email) && password.length >= 6;

  const reset = (nextMode: Mode) => {
    setError(null);
    setSuccess(null);
    setTouched({ email: false, password: false });
    setMode(nextMode);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
        setLoading(false);
      } else if (mode === "signup") {
        await signUp(email.trim(), password);
        setLoading(false);
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
        );
        if (resetError) throw resetError;
        setSuccess("Password reset link sent! Check your inbox.");
        setLoading(false);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(friendlyError(msg));
      setLoading(false);
    }
  };

  const headings: Record<Mode, { title: string; subtitle: string }> = {
    signin: { title: "Welcome back", subtitle: "Sign in to your account" },
    signup: {
      title: "Create account",
      subtitle: "Start managing your finances",
    },
    forgot: {
      title: "Forgot password?",
      subtitle: "We'll send a reset link to your email",
    },
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.brand, { color: theme.veloBlue }]}>flux</Text>
            <Text style={[styles.title, { color: theme.text }]}>
              {headings[mode].title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              {headings[mode].subtitle}
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.subtext }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    borderColor: emailError ? "#EF4444" : theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={theme.subtext}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              {emailError && (
                <Text style={styles.fieldError}>{emailError}</Text>
              )}
            </View>

            {/* Password — hidden in forgot mode */}
            {mode !== "forgot" && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.subtext }]}>
                  Password
                </Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.surface,
                        borderColor: passwordError ? "#EF4444" : theme.border,
                        color: theme.text,
                        paddingRight: 48,
                      },
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor={theme.subtext}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  />
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={8}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color={theme.subtext} />
                    ) : (
                      <Eye size={18} color={theme.subtext} />
                    )}
                  </Pressable>
                </View>
                {passwordError && (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                )}

                {/* Forgot password link */}
                {mode === "signin" && (
                  <Pressable onPress={() => reset("forgot")} hitSlop={8}>
                    <Text
                      style={[styles.forgotLink, { color: theme.veloBlue }]}
                    >
                      Forgot password?
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {error && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: "rgba(239,68,68,0.1)" },
                ]}
              >
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {success && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: "rgba(16,185,129,0.1)" },
                ]}
              >
                <Text style={[styles.errorText, { color: "#10B981" }]}>
                  {success}
                </Text>
              </View>
            )}

            <Button
              title={
                mode === "signin"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Send Reset Link"
              }
              onPress={handleSubmit}
              loading={loading}
              disabled={!isValid}
              style={styles.btn}
            />
          </View>

          {/* Bottom toggle */}
          {mode === "forgot" ? (
            <Pressable style={styles.toggle} onPress={() => reset("signin")}>
              <Text style={[styles.toggleText, { color: theme.subtext }]}>
                {"Back to "}
                <Text
                  style={{ color: theme.veloBlue, fontFamily: "Inter-Bold" }}
                >
                  Sign in
                </Text>
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.toggle}
              onPress={() => reset(mode === "signin" ? "signup" : "signin")}
            >
              <Text style={[styles.toggleText, { color: theme.subtext }]}>
                {mode === "signin"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Text
                  style={{ color: theme.veloBlue, fontFamily: "Inter-Bold" }}
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </Text>
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 32,
  },
  header: { gap: 8 },
  brand: {
    fontSize: 28,
    fontFamily: "Inter-Black",
    letterSpacing: -1,
    marginBottom: 8,
  },
  title: { fontSize: 26, fontFamily: "Inter-Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter-Regular" },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontFamily: "Inter-Bold" },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  forgotLink: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
    textAlign: "right",
    marginTop: 4,
  },
  fieldError: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#EF4444",
    marginTop: 2,
  },
  errorBox: { borderRadius: 10, padding: 12 },
  errorText: { fontSize: 13, fontFamily: "Inter-Regular", color: "#EF4444" },
  btn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { fontSize: 15, fontFamily: "Inter-Bold", color: "#fff" },
  toggle: { alignItems: "center" },
  toggleText: { fontSize: 14, fontFamily: "Inter-Regular" },
});
