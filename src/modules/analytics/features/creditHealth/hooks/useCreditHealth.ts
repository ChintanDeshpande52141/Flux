import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCreditHealth } from "../services/creditHealthService";

export const useCreditHealth = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-health"],
    queryFn: getCreditHealth,
    enabled: !!session,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
