import { useEffect, useState } from "react";
import { getSubscriptionDetail } from "../services/subscriptionDetailService";
import { SubscriptionDetailData } from "../types";

export const useSubscriptionDetail = (id: string) => {
  const [data, setData] = useState<SubscriptionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubscriptionDetail(id)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
};
