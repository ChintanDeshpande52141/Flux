import { apiGet } from "@/shared/services/apiClient";
import { CreditHealthData } from "../types";

export const getCreditHealth = (): Promise<CreditHealthData> =>
  apiGet<CreditHealthData>("/analytics/credit-health");
