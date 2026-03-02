import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LogEntry } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getLogs();
      // Sort newest first
      return [...entries].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) return;
      await actor.addLog(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

export function useClearLogs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.clearLogs();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
