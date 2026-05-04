import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSpendingPulse } from "../services/spendingPulseService";

const TWO_MINUTES = 1000 * 60 * 2;

export const useSpendingPulse = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["spending-pulse", session?.user?.id],
    queryFn: getSpendingPulse,
    enabled: !!session,
    staleTime: TWO_MINUTES,
    gcTime: TWO_MINUTES * 5,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
