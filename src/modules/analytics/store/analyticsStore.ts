import { createContext, Dispatch, useContext } from "react";

export type AnalyticsState = {
  selectedPeriod: string;
};

export type AnalyticsAction = { type: "SET_PERIOD"; payload: string };

export const initialState: AnalyticsState = {
  selectedPeriod: "weekly",
};

export const analyticsReducer = (
  state: AnalyticsState,
  action: AnalyticsAction
): AnalyticsState => {
  switch (action.type) {
    case "SET_PERIOD":
      return { ...state, selectedPeriod: action.payload };
    default:
      return state;
  }
};

export const AnalyticsContext = createContext<{
  state: AnalyticsState;
  dispatch: Dispatch<AnalyticsAction>;
} | null>(null);

export const useAnalyticsStore = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalyticsStore must be used inside AnalyticsProvider");
  return ctx;
};
