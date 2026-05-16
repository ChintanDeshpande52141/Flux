import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/shared/context/OnboardingContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 8000),
      staleTime: 1000 * 60 * 2,
    },
  },
});

function AppShell({
  fontsLoaded,
  children,
}: {
  fontsLoaded: boolean;
  children: React.ReactNode;
}) {
  const { loading: authLoading, session } = useAuth();
  const { loading: onboardingLoading } = useOnboarding();
  // Only wait for onboarding if there's a session
  const ready = fontsLoaded && !authLoading && (!session || !onboardingLoading);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Show loading screen while waiting for fonts or onboarding data
  if (!ready) return <LoadingScreen message="Loading..." />;
  return <>{children}</>;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { loading: onboardingLoading, onboarded } = useOnboarding();
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => {
    // Wait for everything to settle
    // If we have a session but we don't know the onboarding status yet, DO NOTHING
    if (authLoading || (session && onboardingLoading)) {
      return;
    }

    const inAuthGroup = segments[0] === "login";
    const inOnboarding = segments[0] === "onboarding";

    if (!session) {
      if (!inAuthGroup) router.replace("/login");
    } else {
      // At this point, we KNOW session exists AND onboardingLoading is false
      if (!onboarded) {
        if (!inOnboarding) router.replace("/onboarding");
      } else {
        if (inAuthGroup || inOnboarding) router.replace("/(tabs)");
      }
    }
  }, [session, authLoading, onboardingLoading, onboarded, segments]);

  // Show loading screen while waiting for onboarding data
  if (authLoading || (session && onboardingLoading)) {
    return <LoadingScreen message="Loading your data..." />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <AppShell fontsLoaded={fontsLoaded ?? false}>
              <AuthGuard>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="spending-analysis"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="transactions"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="budget-settings"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </AuthGuard>
            </AppShell>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
