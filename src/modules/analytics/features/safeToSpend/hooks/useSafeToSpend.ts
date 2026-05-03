import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSafeToSpend } from "../services/safeToSpendService";

export const useSafeToSpend = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["safe-to-spend"],
    queryFn: getSafeToSpend,
    enabled: !!session,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
