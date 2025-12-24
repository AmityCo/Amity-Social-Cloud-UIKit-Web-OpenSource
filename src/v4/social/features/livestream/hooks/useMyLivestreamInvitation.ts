import { InvitationRepository, InvitationTypeEnum } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

export default function useMyRoomInvitation(room?: Amity.Room) {
  const { data } = useQuery({
    queryKey: ['asc-uikit', 'InvitationRepository', 'getMyRoomInvitation'],
    queryFn: () => room?.getMyInvitation(),
    enabled: !!room,
  });

  return data;
}
