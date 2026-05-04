import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCreditHealth } from "../services/creditHealthService";

export const useCreditHealth = () => {
  const { session } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["credit-health", session?.user?.id],
    queryFn: async () => {
      try {
        return await getCreditHealth();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.toLowerCase().includes("not found") || msg.includes("404"))
          return null;
        throw e;
      }
    },
    enabled: !!session,
  });
  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
