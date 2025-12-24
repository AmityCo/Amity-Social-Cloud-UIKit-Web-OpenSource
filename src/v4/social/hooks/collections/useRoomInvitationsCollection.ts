import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

const QUERY_LIMIT = 20;

export default function useRoomInvitationsCollection({
  room,
  statuses = [],
  shouldCall,
}: {
  room: Amity.Room;
  statuses?: string[];
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: room.getInvitations,
    params: {
      limit: QUERY_LIMIT,
    },
    shouldCall: !!room && shouldCall,
  });

  return {
    invitations: items,
    ...rest,
  };
}
