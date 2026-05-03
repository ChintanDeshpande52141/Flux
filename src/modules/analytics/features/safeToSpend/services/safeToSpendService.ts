import { apiGet } from "@/shared/services/apiClient";
import { SafeToSpendData } from "../types";

export const getSafeToSpend = (): Promise<SafeToSpendData> =>
  apiGet<SafeToSpendData>("/analytics/safe-to-spend");
