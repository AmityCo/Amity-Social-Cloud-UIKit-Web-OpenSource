import { RoomPresenceRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

export function useWatchingCount({ roomId }: { roomId?: string | null }): {
  watchingCount: number;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchingCount', roomId],
    queryFn: async () => {
      if (!roomId) return 0;
      const result = await RoomPresenceRepository.getRoomUserCount(roomId);
      // Handle if result is an object with count property or a number
      return typeof result === 'number' ? result : result?.count || 0;
    },
    enabled: !!roomId,
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    // Keep the data for a short time
    gcTime: 30000, // 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    watchingCount: data || 0,
    isLoading,
    error,
  };
}
