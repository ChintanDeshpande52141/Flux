export type SubscriptionDetailData = {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  category: string;
  description: string;
  history: { date: string; amount: number }[];
};
