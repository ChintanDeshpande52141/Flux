import { apiGet } from "@/shared/services/apiClient";
import { AiSuggestionsData } from "../types";

export const getAiSuggestions = (): Promise<AiSuggestionsData> =>
  apiGet<AiSuggestionsData>("/chat/suggestions");
