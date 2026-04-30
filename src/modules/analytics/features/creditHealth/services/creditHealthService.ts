import { CreditHealthData } from "../types";

export const getCreditHealth = async (): Promise<CreditHealthData> => {
  // TODO: Replace with Express API call — GET /api/v1/analytics/credit-health
  return { score: 742, status: "good", change: 5 };
};
