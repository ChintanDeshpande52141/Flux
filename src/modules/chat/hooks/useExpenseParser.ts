import { useCallback, useState } from "react";
import { parseExpense, isSimpleExpense, ParsedExpense, ParseResult } from "../services/expenseParser";
import { resolveCategory, Category } from "../services/categoryResolver";

export interface ExpenseParseResult extends ParsedExpense {
  category: Category;
  isLocal: boolean;
}

export interface UseExpenseParserReturn {
  parseExpenseText: (text: string) => Promise<ExpenseParseResult | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to parse expense text locally with category resolution
 * Returns structured expense data or null if parsing fails
 */
export function useExpenseParser(): UseExpenseParserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExpenseText = useCallback(async (text: string): Promise<ExpenseParseResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if this is a simple expense that can be parsed locally
      if (!isSimpleExpense(text)) {
        setError("Text requires AI processing");
        return null;
      }

      // Parse the expense using regex
      const parseResult: ParseResult = parseExpense(text);
      
      if (!parseResult.success || !parseResult.data) {
        setError(parseResult.error || "Failed to parse expense");
        return null;
      }

      // Resolve the category
      const category = await resolveCategory(parseResult.data.description);

      // Return the complete parsed expense
      return {
        ...parseResult.data,
        category,
        isLocal: true,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    parseExpenseText,
    isLoading,
    error,
  };
}
