import { apiGet } from "@/shared/services/apiClient";
import { SubscriptionListData } from "../types";

export const getSubscriptionList = (): Promise<SubscriptionListData> =>
  apiGet<SubscriptionListData>("/subscriptions");
