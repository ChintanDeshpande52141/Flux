import { createContext, Dispatch, useContext } from "react";

export type SubscriptionsState = {
  selectedId: string | null;
};

export type SubscriptionsAction = { type: "SET_SELECTED"; payload: string | null };

export const initialState: SubscriptionsState = {
  selectedId: null,
};

export const subscriptionsReducer = (
  state: SubscriptionsState,
  action: SubscriptionsAction
): SubscriptionsState => {
  switch (action.type) {
    case "SET_SELECTED":
      return { ...state, selectedId: action.payload };
    default:
      return state;
  }
};

export const SubscriptionsContext = createContext<{
  state: SubscriptionsState;
  dispatch: Dispatch<SubscriptionsAction>;
} | null>(null);

export const useSubscriptionsStore = () => {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error("useSubscriptionsStore must be used inside SubscriptionsProvider");
  return ctx;
};
