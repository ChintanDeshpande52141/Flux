export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  logged?: LoggedTransaction | null;
  updated?: UpdatedSetting | null;
};

export type LoggedTransaction = {
  type: "transaction" | "subscription";
  id: string;
  merchant: string;
  category: string;
  amount: number;
  paymentType: string;
  transactedAt?: string;
};

export type UpdatedSetting = {
  field: "savings_goal" | "total_income";
  value: number;
};

export type Suggestion = {
  id: string;
  text: string;
  category: string;
  merchant?: string;
  amount?: number;
  paymentType?: string;
};

export type MessageFeedData = {
  messages: Message[];
};

export type SendMessageResponse = {
  userMessage: Message;
  aiMessage: Message;
  logged: LoggedTransaction | null;
  updated: UpdatedSetting | null;
};
