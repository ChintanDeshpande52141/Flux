import { SubscriptionListData } from "../types";

export const getSubscriptionList = async (): Promise<SubscriptionListData> => {
  // TODO: Replace with Express API call — GET /api/v1/subscriptions
  return {
    dailyImpact: 142.5,
    totalMonthly: 4275,
    upcomingCount: 3,
    categories: [
      {
        label: "ENTERTAINMENT",
        items: [
          {
            id: "1",
            name: "Netflix",
            subtitle: "Premium Streaming",
            amount: 649,
            billingCycle: "monthly",
            nextBillingDate: "2026-05-10",
            category: "Entertainment",
            badge: "Auto",
            logoInitial: "N",
            logoColor: "#E50914",
          },
          {
            id: "2",
            name: "Spotify",
            subtitle: "Music & Podcasts",
            amount: 179,
            billingCycle: "monthly",
            nextBillingDate: "2026-05-14",
            category: "Entertainment",
            logoInitial: "S",
            logoColor: "#1DB954",
          },
        ],
      },
      {
        label: "LIFESTYLE & CORE",
        items: [
          {
            id: "3",
            name: "Cult.fit Gym",
            subtitle: "Health & Wellness",
            amount: 1200,
            billingCycle: "monthly",
            nextBillingDate: "2026-05-01",
            category: "Health",
            badge: "Elite",
            logoInitial: "C",
            logoColor: "#FF6B35",
          },
          {
            id: "4",
            name: "iCloud Storage",
            subtitle: "Cloud Services",
            amount: 75,
            billingCycle: "monthly",
            nextBillingDate: "2026-05-22",
            category: "Tech",
            logoInitial: "i",
            logoColor: "#007AFF",
          },
          {
            id: "5",
            name: "Apartment Rent",
            subtitle: "Housing",
            amount: 22000,
            billingCycle: "monthly",
            nextBillingDate: "2026-05-01",
            category: "Housing",
            badge: "Fixed",
            logoInitial: "A",
            logoColor: "#6366F1",
          },
        ],
      },
    ],
  };
};
