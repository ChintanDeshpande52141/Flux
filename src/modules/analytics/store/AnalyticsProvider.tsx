import React, { useReducer } from "react";
import { AnalyticsContext, analyticsReducer, initialState } from "./analyticsStore";

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);
  return (
    <AnalyticsContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
