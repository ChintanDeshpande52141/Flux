import { useAuth } from "@/shared/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getChatSuggestions, getMessageFeed } from "../services/messageFeedService";

export const useChatMessages = () => {
  const { session } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["chat-messages", session?.user?.id],
    queryFn: getMessageFeed,
    enabled: !!session,
    staleTime: 0,
  });
  return { messages: data?.messages ?? [], isLoading };
};

export const useChatSuggestions = () => {
  const { session } = useAuth();
  const { data } = useQuery({
    queryKey: ["chat-suggestions", session?.user?.id],
    queryFn: getChatSuggestions,
    enabled: !!session,
    staleTime: 1000 * 60 * 5,
  });
  return { suggestions: data?.suggestions ?? [] };
};
