import { useEffect, useState } from "react";
import { getSubscriptionList } from "../services/subscriptionListService";
import { SubscriptionListData } from "../types";

export const useSubscriptionList = () => {
  const [data, setData] = useState<SubscriptionListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubscriptionList()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
