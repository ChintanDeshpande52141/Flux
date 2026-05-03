import { apiGet } from "@/shared/services/apiClient";

export type PaymentType = "UPI" | "Cash" | "Credit" | "Debit";
export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Others";

export type Transaction = {
  id: string;
  merchant: string;
  category: Category;
  date: string;
  timestamp: Date;
  amount: number;
  paymentType: PaymentType;
};

export type PeriodPreset = "Today" | "This Week" | "This Month";

export type TransactionFilters = {
  period: PeriodPreset | "Custom";
  customRange?: { start: string; end: string };
  paymentTypes: (PaymentType | "All")[];
  categories: (Category | "All")[];
};

export const getTransactions = (
  filters: TransactionFilters,
): Promise<Transaction[]> => {
  const params: Record<string, string | undefined> = {
    period: filters.period,
    paymentTypes: filters.paymentTypes.join(","),
    categories: filters.categories.join(","),
  };
  if (filters.period === "Custom" && filters.customRange) {
    params.start = filters.customRange.start;
    params.end = filters.customRange.end;
  }
  return apiGet<Transaction[]>("/transactions", params);
};
