import { useEffect, useState } from "react";
import { getAiSuggestions } from "../services/aiSuggestionsService";
import { AiSuggestionsData } from "../types";

export const useAiSuggestions = () => {
  const [data, setData] = useState<AiSuggestionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAiSuggestions()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
