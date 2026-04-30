import { SpendingVelocityData } from "../types";

export const getSpendingVelocity = async (): Promise<SpendingVelocityData> => {
  // TODO: Replace with Express API call — GET /api/v1/analytics/spending-velocity
  return {
    rate: 72,
    target: 80,
    trend: "up",
    percentChange: 12,
    tip: "Your velocity is moderate. Try reducing dining out next week to stay under your limit.",
  };
};
