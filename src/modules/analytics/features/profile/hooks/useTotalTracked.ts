import { apiGet } from "@/shared/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export async function fetchTotalTracked() {
  const response = await apiGet<{ totalTracked: number }>("/analytics/totals");
  return response;
}

export function useTotalTracked() {
  return useQuery({
    queryKey: ["analytics", "totals"],
    queryFn: fetchTotalTracked,
    retry: false,
  });
}
