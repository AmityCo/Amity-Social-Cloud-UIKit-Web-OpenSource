import { RoomPresenceRepository } from '@amityco/ts-sdk';
import { useQuery, QueryObserverResult } from '@tanstack/react-query';

export function useWatchingUsers({ room }: { room?: Amity.Room | null }): {
  watchingUsers: Amity.User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<Amity.User[], Error>>;
} {
  const {
    data: watchingUsers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['watchingUsers', room?.roomId],
    queryFn: async () => {
      if (!room?.roomId) return [];
      const result = await RoomPresenceRepository.getRoomOnlineUsers(room.roomId);
      return result.data || [];
    },
    enabled: !!room?.roomId,
    // Disable caching
    gcTime: 0, // Previously called cacheTime - data is garbage collected immediately
    staleTime: 0, // Data is always considered stale
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    watchingUsers,
    isLoading,
    error,
    refetch,
  };
}
