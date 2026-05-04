import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSafeToSpend } from "../services/safeToSpendService";

const TWO_MINUTES = 1000 * 60 * 2;

export const useSafeToSpend = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["safe-to-spend", session?.user?.id],
    queryFn: getSafeToSpend,
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
