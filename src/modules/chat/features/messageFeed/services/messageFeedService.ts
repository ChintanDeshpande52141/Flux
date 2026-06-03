import { apiGet, apiPost } from "@/shared/services/apiClient";
import { resolveCategory } from "../../../services/categoryResolver";
import { isSimpleExpense, parseExpense } from "../../../services/expenseParser";
import { MessageFeedData, SendMessageResponse, Suggestion } from "../types";

export const getMessageFeed = (): Promise<MessageFeedData> =>
  apiGet<MessageFeedData>("/chat/messages");

export const sendChatMessage = async (
  text: string,
  parsedData?: {
    intent: "log_expense";
    merchant: string;
    category: string;
    amount: number;
    paymentType: string;
    isRecurring: boolean;
    reply: string;
  },
): Promise<SendMessageResponse> => {
  // Try local expense parsing first if no parsedData provided
  if (!parsedData && isSimpleExpense(text)) {
    try {
      const parseResult = parseExpense(text);

      if (parseResult.success && parseResult.data) {
        const category = await resolveCategory(parseResult.data.description);

        // Send to new /expenses endpoint using apiClient for auth
        const expenseResponse = await apiPost("/expenses", {
          amount: parseResult.data.amount,
          description: parseResult.data.description,
          category,
          paymentType: parseResult.data.paymentType || "UPI",
          isRecurring: false,
        });

        if (expenseResponse) {
          // Create a message record for the chat
          return apiPost<SendMessageResponse>("/chat/messages", {
            text,
            sender: "user",
            parsedData: {
              intent: "log_expense",
              merchant: parseResult.data.description,
              category,
              amount: parseResult.data.amount,
              paymentType: parseResult.data.paymentType || "UPI",
              isRecurring: false,
              reply: `Logged ₹${parseResult.data.amount} for ${parseResult.data.description} via ${parseResult.data.paymentType || "UPI"}.`,
            },
          });
        }
      }
    } catch (error) {
      console.error("Local parsing failed, falling back to API:", error);
    }
  }

  // Fallback to regular chat API
  return apiPost<SendMessageResponse>("/chat/messages", {
    text,
    sender: "user",
    parsedData,
  });
};

export const getChatSuggestions = (): Promise<{ suggestions: Suggestion[] }> =>
  apiGet<{ suggestions: Suggestion[] }>("/chat/suggestions");
