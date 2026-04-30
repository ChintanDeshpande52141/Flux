import { SubscriptionDetailData } from "../types";

export const getSubscriptionDetail = async (id: string): Promise<SubscriptionDetailData> => {
  // TODO: Replace with Express API call — GET /api/v1/subscriptions/:id
  return {
    id,
    name: "",
    amount: 0,
    billingCycle: "monthly",
    nextBillingDate: "",
    category: "",
    description: "",
    history: [],
  };
};
