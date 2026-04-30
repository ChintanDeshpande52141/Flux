export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

export type MessageFeedData = {
  messages: Message[];
};
