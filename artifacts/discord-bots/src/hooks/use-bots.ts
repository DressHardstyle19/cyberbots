import { useQueryClient } from "@tanstack/react-query";
import {
  useListBots,
  useCreateBot as useGenCreateBot,
  useVoteBot as useGenVoteBot,
  getListBotsQueryKey,
  type CreateBotInput
} from "@workspace/api-client-react";

export function useBots() {
  return useListBots({
    query: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    }
  });
}

export function useAddBot() {
  const queryClient = useQueryClient();
  return useGenCreateBot({
    mutation: {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
      },
    },
  });
}

export function useVoteForBot() {
  const queryClient = useQueryClient();
  return useGenVoteBot({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
      },
    },
  });
}
