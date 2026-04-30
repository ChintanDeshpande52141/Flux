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

export const getSpendingAnalysis = async (): Promise<SpendingAnalysisData> => {
  // TODO: Replace with Express API call — GET /api/v1/analytics/spending-analysis
  return {
    thisWeek: {
      amount: 6110,
      budget: 11100,
      percentUnder: 3,
      isUnder: true,
    },
    dailyBreakdown: [
      { label: "Mon", value: 900 },
      { label: "Tue", value: 750 },
      { label: "Wed", value: 1100 },
      { label: "Thu", value: 600 },
      { label: "Fri", value: 950 },
      { label: "Sat", value: 1200 },
      { label: "Sun", value: 610 },
    ],
    categoryBreakdown: [
      { label: "Food & Dining", percent: 23, amount: 8500, color: "#00BAE5" },
      { label: "Transportation", percent: 17, amount: 4200, color: "#6366F1" },
      { label: "Shopping", percent: 25, amount: 6100, color: "#F59E0B" },
      { label: "Entertainment", percent: 13, amount: 3200, color: "#10B981" },
      { label: "Others", percent: 10, amount: 2400, color: "#9CA3AF" },
    ],
    monthlyTrend: [
      { label: "Jul", value: 18500 },
      { label: "Aug", value: 22000 },
      { label: "Sep", value: 19800 },
      { label: "Oct", value: 21150 },
    ],
    avgMonthlySpending: 21150,
    insights: [
      {
        id: "1",
        title: "Weekend Spike",
        body: "Your spending increases by 45% on weekends. Consider setting weekend budgets.",
        type: "warning",
      },
      {
        id: "2",
        title: "Great Progress",
        body: "You're spending 12% less on dining compared to last month!",
        type: "success",
      },
    ],
  };
};
