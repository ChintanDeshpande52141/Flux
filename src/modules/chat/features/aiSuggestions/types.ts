export type AiSuggestion = {
  id: string;
  text: string;
  category: string;
};

export type AiSuggestionsData = {
  suggestions: AiSuggestion[];
};
