import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/shared/context/OnboardingContext";
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
  const { loading: authLoading } = useAuth();
  const { loading: onboardingLoading } = useOnboarding();
  const ready = fontsLoaded && !authLoading && !onboardingLoading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { onboarded } = useOnboarding();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "login";
    const inOnboarding = segments[0] === "onboarding";

    if (!session) {
      if (!inAuthGroup) router.replace("/login");
    } else if (!onboarded) {
      if (!inOnboarding) router.replace("/onboarding");
    } else {
      if (inAuthGroup || inOnboarding) router.replace("/(tabs)");
    }
  }, [session, onboarded, segments]);

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
      <AuthProvider>
        <OnboardingProvider>
          <AppShell fontsLoaded={fontsLoaded ?? false}>
            <AuthGuard>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="spending-analysis"
                  options={{ headerShown: false }}
                />
              </Stack>
              <StatusBar style="auto" />
            </AuthGuard>
          </AppShell>
        </OnboardingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
