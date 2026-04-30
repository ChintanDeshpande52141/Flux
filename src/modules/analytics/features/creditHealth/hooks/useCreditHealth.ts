import { useEffect, useState } from "react";
import { getCreditHealth } from "../services/creditHealthService";
import { CreditHealthData } from "../types";

export const useCreditHealth = () => {
  const [data, setData] = useState<CreditHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCreditHealth()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
