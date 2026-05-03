import { apiGet, apiPost } from "@/shared/services/apiClient";
import { MessageFeedData } from "../types";

export const getMessageFeed = (): Promise<MessageFeedData> =>
  apiGet<MessageFeedData>("/chat/messages");

export const sendMessage = (text: string, sender: "user" | "ai" = "user") =>
  apiPost<void>("/chat/messages", { text, sender });
