import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSpendingVelocity } from "../services/spendingVelocityService";

const TWO_MINUTES = 1000 * 60 * 2;

export const useSpendingVelocity = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["spending-velocity", session?.user?.id],
    queryFn: getSpendingVelocity,
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
