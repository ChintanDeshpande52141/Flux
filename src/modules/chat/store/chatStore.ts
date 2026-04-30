import { createContext, Dispatch, useContext } from "react";

export type ChatState = {
  activeConversationId: string | null;
};

export type ChatAction = { type: "SET_CONVERSATION"; payload: string | null };

export const initialState: ChatState = {
  activeConversationId: null,
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CONVERSATION":
      return { ...state, activeConversationId: action.payload };
    default:
      return state;
  }
};

export const ChatContext = createContext<{
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
} | null>(null);

export const useChatStore = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatStore must be used inside ChatProvider");
  return ctx;
};
