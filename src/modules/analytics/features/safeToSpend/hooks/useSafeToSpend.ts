import { useEffect, useState } from "react";
import { getSafeToSpend } from "../services/safeToSpendService";
import { SafeToSpendData } from "../types";

export const useSafeToSpend = () => {
  const [data, setData] = useState<SafeToSpendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSafeToSpend()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
