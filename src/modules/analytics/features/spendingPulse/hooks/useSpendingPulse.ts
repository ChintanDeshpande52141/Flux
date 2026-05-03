import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSpendingPulse } from "../services/spendingPulseService";

export const useSpendingPulse = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["spending-pulse"],
    queryFn: getSpendingPulse,
    enabled: !!session,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
