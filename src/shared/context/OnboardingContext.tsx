import { useAuth } from "@/shared/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
export type IncomeSource = { name: string; amount: number };
export type CreditCard = { name: string; limit: number; spendCap: number };

export type OnboardingData = {
  incomeSources: IncomeSource[];
  totalIncome: number;
  savingsGoal: number;
  creditCards: CreditCard[];
};

type OnboardingContextValue = {
  onboarded: boolean;
  loading: boolean;
  data: OnboardingData | null;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updateData: (data: Partial<OnboardingData>) => Promise<void>;
};

const KEYS = {
  ONBOARDED: "flux_onboarded",
  DATA: "flux_onboarding_data",
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OnboardingData | null>(null);
  const { session } = useAuth();
  useEffect(() => {
    const load = async () => {
      try {
        const [flag, raw] = await Promise.all([
          AsyncStorage.getItem(KEYS.ONBOARDED),
          AsyncStorage.getItem(KEYS.DATA),
        ]);
        if (flag === "true") {
          setOnboarded(true);
          if (raw) setData(JSON.parse(raw));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!session) {
      // User signed out, clear onboarding state
      setOnboarded(false);
      setData(null);
    }
  }, [session?.user?.id]);

  const completeOnboarding = async (d: OnboardingData) => {
    await Promise.all([
      AsyncStorage.setItem(KEYS.ONBOARDED, "true"),
      AsyncStorage.setItem(KEYS.DATA, JSON.stringify(d)),
    ]);
    setData(d);
    setOnboarded(true);
  };

  const resetOnboarding = async () => {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.ONBOARDED),
      AsyncStorage.removeItem(KEYS.DATA),
    ]);
    setData(null);
    setOnboarded(false);
  };

  const updateData = async (partial: Partial<OnboardingData>) => {
    const next = {
      ...(data ?? {
        incomeSources: [],
        totalIncome: 0,
        savingsGoal: 0,
        creditCards: [],
      }),
      ...partial,
    };
    await AsyncStorage.setItem(KEYS.DATA, JSON.stringify(next));
    setData(next);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboarded,
        loading,
        data,
        completeOnboarding,
        resetOnboarding,
        updateData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
};
