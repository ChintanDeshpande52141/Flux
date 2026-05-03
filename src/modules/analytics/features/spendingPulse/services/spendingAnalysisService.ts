import { apiGet } from "@/shared/services/apiClient";

export type SpendingAnalysisData = {
  thisWeek: {
    amount: number;
    budget: number;
    percentUnder: number;
    isUnder: boolean;
  };
  dailyBreakdown: { label: string; value: number }[];
  categoryBreakdown: {
    label: string;
    percent: number;
    amount: number;
    color: string;
  }[];
  monthlyTrend: { label: string; value: number }[];
  avgMonthlySpending: number;
  insights: {
    id: string;
    title: string;
    body: string;
    type: "warning" | "success" | "info";
  }[];
};

export const getSpendingAnalysis = (): Promise<SpendingAnalysisData> =>
  apiGet<SpendingAnalysisData>("/analytics/spending-analysis");
