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
      return (result.data ?? []).filter((user) => !!user?.displayName || !!user?.userId);
    },
    enabled: !!room?.roomId,
    // Never serve a cached "Who's watching" list — the presence set churns
    // fast, and any stale row rendered without a displayName reads as broken.
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {
    watchingUsers,
    isLoading,
    error,
    refetch,
  };
}
