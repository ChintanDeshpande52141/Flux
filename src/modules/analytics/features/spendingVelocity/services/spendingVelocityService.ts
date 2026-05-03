import { apiGet } from "@/shared/services/apiClient";
import { SpendingVelocityData } from "../types";

export const getSpendingVelocity = (): Promise<SpendingVelocityData> =>
  apiGet<SpendingVelocityData>("/analytics/spending-velocity");
