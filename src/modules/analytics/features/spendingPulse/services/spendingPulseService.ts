import { apiGet } from "@/shared/services/apiClient";
import { SpendingPulseData } from "../types";

export const getSpendingPulse = (): Promise<SpendingPulseData> =>
  apiGet<SpendingPulseData>("/analytics/spending-pulse");
