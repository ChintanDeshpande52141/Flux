export type SubscriptionBadge = "Auto" | "Fixed" | "Elite" | "Manual";

export type Subscription = {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  category: string;
  badge?: SubscriptionBadge;
  logoInitial: string;
  logoColor: string;
  paymentType?: "UPI" | "Cash" | "Credit" | "Debit";
};

export type SubscriptionCategory = {
  label: string;
  items: Subscription[];
};

export type SubscriptionListData = {
  categories: SubscriptionCategory[];
  totalMonthly: number;
  dailyImpact: number;
  upcomingCount: number;
};
