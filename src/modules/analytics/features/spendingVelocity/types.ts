export type SpendingVelocityData = {
  rate: number;
  target: number;
  trend: "up" | "down" | "stable";
  percentChange: number;
  tip: string;
};
