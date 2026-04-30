import { useEffect, useState } from "react";
import { getSpendingVelocity } from "../services/spendingVelocityService";
import { SpendingVelocityData } from "../types";

export const useSpendingVelocity = () => {
  const [data, setData] = useState<SpendingVelocityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSpendingVelocity()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
