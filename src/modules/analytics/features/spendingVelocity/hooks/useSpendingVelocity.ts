import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getSpendingVelocity } from "../services/spendingVelocityService";

export const useSpendingVelocity = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["spending-velocity"],
    queryFn: getSpendingVelocity,
    enabled: !!session,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
