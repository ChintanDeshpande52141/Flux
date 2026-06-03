export interface ParsedExpense {
  amount: number;
  description: string;
  paymentType?: "UPI" | "Cash" | "Credit" | "Debit";
}

export interface ParseResult {
  success: boolean;
  data?: ParsedExpense;
  error?: string;
}

/**
 * Parse expense text using regex patterns
 * Examples:
 * - "Burger 300" → { amount: 300, description: "burger" }
 * - "Petrol 500 cash" → { amount: 500, description: "petrol", paymentType: "Cash" }
 * - "Swiggy 200" → { amount: 200, description: "swiggy" }
 * - "Spent 500 on petrol" → { amount: 500, description: "petrol" }
 */
export function parseExpense(text: string): ParseResult {
  // Clean text
  const cleaned = text
    .toLowerCase()
    .replace(/[₹,]/g, "")
    .replace(/^\+?\s*/, "")
    .trim();

  // Pattern 1: Description + Amount (most common)
  // "burger 300", "swiggy 200", "netflix 649"
  const pattern1 = /^([a-z\s]+?)\s+(\d+(?:\.\d+)?k?)(?:\s+(cash|upi|credit|debit))?$/i;
  const match1 = cleaned.match(pattern1);
  
  if (match1) {
    const [, description, amountStr, paymentType] = match1;
    const amount = parseAmount(amountStr);
    if (amount > 0) {
      return {
        success: true,
        data: {
          amount,
          description: description.trim(),
          paymentType: paymentType ? normalizePaymentType(paymentType) : undefined,
        },
      };
    }
  }

  // Pattern 2: Amount + Description
  // "300 burger", "500 petrol", "649 netflix"
  const pattern2 = /^(\d+(?:\.\d+)?k?)\s+([a-z\s]+?)(?:\s+(cash|upi|credit|debit))?$/i;
  const match2 = cleaned.match(pattern2);
  
  if (match2) {
    const [, amountStr, description, paymentType] = match2;
    const amount = parseAmount(amountStr);
    if (amount > 0) {
      return {
        success: true,
        data: {
          amount,
          description: description.trim(),
          paymentType: paymentType ? normalizePaymentType(paymentType) : undefined,
        },
      };
    }
  }

  // Pattern 3: "Spent X on Y"
  // "spent 500 on petrol", "spent 200 on coffee"
  const pattern3 = /^spent\s+(\d+(?:\.\d+)?k?)\s+on\s+([a-z\s]+?)(?:\s+(cash|upi|credit|debit))?$/i;
  const match3 = cleaned.match(pattern3);
  
  if (match3) {
    const [, amountStr, description, paymentType] = match3;
    const amount = parseAmount(amountStr);
    if (amount > 0) {
      return {
        success: true,
        data: {
          amount,
          description: description.trim(),
          paymentType: paymentType ? normalizePaymentType(paymentType) : undefined,
        },
      };
    }
  }

  // Pattern 4: Just amount + payment type (no description)
  // "500 cash", "300 upi"
  const pattern4 = /^(\d+(?:\.\d+)?k?)\s+(cash|upi|credit|debit)$/i;
  const match4 = cleaned.match(pattern4);
  
  if (match4) {
    const [, amountStr, paymentType] = match4;
    const amount = parseAmount(amountStr);
    if (amount > 0) {
      return {
        success: true,
        data: {
          amount,
          description: "",
          paymentType: normalizePaymentType(paymentType),
        },
      };
    }
  }

  return {
    success: false,
    error: "Could not parse expense format",
  };
}

/**
 * Parse amount string to number
 * Handles: "300", "1.5k", "2k", "500.50"
 */
function parseAmount(amountStr: string): number {
  const lower = amountStr.toLowerCase();
  
  if (lower.endsWith('k')) {
    const num = parseFloat(lower.slice(0, -1));
    return num * 1000;
  }
  
  const num = parseFloat(lower);
  return isNaN(num) ? 0 : num;
}

/**
 * Normalize payment type string
 */
function normalizePaymentType(paymentType: string): "UPI" | "Cash" | "Credit" | "Debit" {
  const normalized = paymentType.toLowerCase();
  
  switch (normalized) {
    case "cash":
      return "Cash";
    case "upi":
      return "UPI";
    case "credit":
      return "Credit";
    case "debit":
      return "Debit";
    default:
      return "UPI"; // Default to UPI (most common in India)
  }
}

/**
 * Check if text is likely a simple expense entry
 * Returns true for patterns that can be parsed locally
 */
export function isSimpleExpense(text: string): boolean {
  const cleaned = text.toLowerCase().trim();
  
  // Check for expense indicators
  const expenseIndicators = [
    /\d+/, // Contains numbers
    /(burger|swiggy|zomato|petrol|netflix|amazon|flipkart|coffee|movie|uber|ola)/, // Common merchants
    /(spent|paid|bought)/, // Action words
  ];
  
  // Check for complex queries that need AI
  const complexPatterns = [
    /(how much|what is|show|analyze|trend|save|goal|income|salary)/, // Analytics questions
    /(change|update|set|modify)/, // Update requests
  ];
  
  const isComplex = complexPatterns.some(pattern => pattern.test(cleaned));
  const hasExpenseIndicators = expenseIndicators.some(pattern => pattern.test(cleaned));
  
  return hasExpenseIndicators && !isComplex;
}
