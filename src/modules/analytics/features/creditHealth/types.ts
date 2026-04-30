export type CreditHealthData = {
  score: number;
  status: "excellent" | "good" | "fair" | "poor";
  change: number;
};
