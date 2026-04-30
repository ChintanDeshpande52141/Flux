import { SafeToSpendData } from "../types";

export const getSafeToSpend = async (): Promise<SafeToSpendData> => {
  // TODO: Replace with Express API call — GET /api/v1/analytics/safe-to-spend
  return {
    amount: 14250,
    currency: "INR",
    period: "this month",
    dailyLimit: 450,
  };
};
