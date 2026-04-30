import { useEffect, useState } from "react";
import { getMessageFeed } from "../services/messageFeedService";
import { MessageFeedData } from "../types";

export const useMessageFeed = () => {
  const [data, setData] = useState<MessageFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMessageFeed()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
