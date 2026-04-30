import React, { useReducer } from "react";
import { SubscriptionsContext, subscriptionsReducer, initialState } from "./subscriptionsStore";

export const SubscriptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(subscriptionsReducer, initialState);
  return (
    <SubscriptionsContext.Provider value={{ state, dispatch }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};
