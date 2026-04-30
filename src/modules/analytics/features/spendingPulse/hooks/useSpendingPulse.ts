import { useEffect, useState } from "react";
import { getSpendingPulse } from "../services/spendingPulseService";
import { SpendingPulseData } from "../types";

export const useSpendingPulse = () => {
  const [data, setData] = useState<SpendingPulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSpendingPulse()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
