import { SpendingPulseData } from "../types";

export const getSpendingPulse = async (): Promise<SpendingPulseData> => {
  // TODO: Replace with Express API call — GET /api/v1/analytics/spending-pulse
  return {
    entries: [
      { label: "Mon", value: 120 },
      { label: "Tue", value: 85 },
      { label: "Wed", value: 200 },
      { label: "Thu", value: 60 },
      { label: "Fri", value: 175 },
      { label: "Sat", value: 90 },
      { label: "Sun", value: 45 },
    ],
    total: 775,
  };
};
