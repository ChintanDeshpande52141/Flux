import { useQuery } from "@tanstack/react-query";
import { getSubscriptionList } from "../services/subscriptionListService";

export const useSubscriptionList = () => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptionList,
  });

  return {
    data: data ?? null,
    loading,
    error: error ? (error as Error).message : null,
  };
};
