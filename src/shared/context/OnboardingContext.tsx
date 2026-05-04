import { useAuth } from "@/shared/context/AuthContext";
import { apiGet, apiPatch, apiPost } from "@/shared/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";

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
  isInitialLoading: boolean;
  data: OnboardingData | null;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updateData: (data: Partial<OnboardingData>) => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const fetchOnboardingData = async () => {
  const response = await apiGet<{
    onboarded_at: string | null;
    income_sources: IncomeSource[];
    credit_cards: CreditCard[];
    total_income: number;
    savings_goal: number;
  }>("/onboarding");

  return response;
};

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const [onboarded, setOnboarded] = useState(false);
  const [data, setData] = useState<OnboardingData | null>(null);

  const { isInitialLoading, data: queryData } = useQuery({
    queryKey: ["onboarding", session?.user?.id],
    queryFn: fetchOnboardingData,
    enabled: !!session,
  });

  // Update local state when query data changes
  React.useEffect(() => {
    if (queryData) {
      if (queryData.onboarded_at) {
        setOnboarded(true);
        setData({
          incomeSources: queryData.income_sources || [],
          creditCards: queryData.credit_cards || [],
          totalIncome: queryData.total_income || 0,
          savingsGoal: queryData.savings_goal || 0,
        });
      } else {
        setOnboarded(false);
        setData({
          incomeSources: queryData.income_sources || [],
          creditCards: queryData.credit_cards || [],
          totalIncome: queryData.total_income || 0,
          savingsGoal: queryData.savings_goal || 0,
        });
      }
    }
  }, [queryData]);

  React.useEffect(() => {
    if (!session) {
      setOnboarded(false);
      setData(null);
    }
  }, [session?.user?.id]);

  const completeOnboarding = async (d: OnboardingData) => {
    await apiPost("/onboarding", {
      income_sources: d.incomeSources,
      credit_cards: d.creditCards,
      total_income: d.totalIncome,
      savings_goal: d.savingsGoal,
    });
    setData(d);
    setOnboarded(true);
  };

  const resetOnboarding = async () => {
    setData(null);
    setOnboarded(false);
  };

  const updateData = async (partial: Partial<OnboardingData>) => {
    const payload: any = {};
    if (partial.incomeSources !== undefined)
      payload.income_sources = partial.incomeSources;
    if (partial.creditCards !== undefined)
      payload.credit_cards = partial.creditCards;
    if (partial.totalIncome !== undefined)
      payload.total_income = partial.totalIncome;
    if (partial.savingsGoal !== undefined)
      payload.savings_goal = partial.savingsGoal;

    await apiPatch("/onboarding", payload);

    const next = {
      ...(data ?? {
        incomeSources: [],
        totalIncome: 0,
        savingsGoal: 0,
        creditCards: [],
      }),
      ...partial,
    };
    setData(next);
  };

  const loading = !!session && isInitialLoading;

  return (
    <OnboardingContext.Provider
      value={{
        onboarded,
        loading,
        isInitialLoading,
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
