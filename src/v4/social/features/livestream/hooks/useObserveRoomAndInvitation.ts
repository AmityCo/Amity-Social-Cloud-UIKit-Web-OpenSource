import { InvitationRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';
import { useRoomSubscription } from './useRoomSubscription';

export const useObserveRoomAndInvitation = ({ room }: { room?: Amity.Room | null }) => {
  const [invitations, setInvitations] = useState<Amity.Invitation[]>();

  useRoomSubscription({ room });

  const observeInvitations = (room: Amity.Room) => {
    return InvitationRepository.getInvitations(
      {
        targetId: room.roomId,
        targetType: 'room',
      },
      (invitations) => {
        setInvitations([...invitations]);
      },
    );
  };

  useEffect(() => {
    const unsubscriber: Amity.Unsubscriber[] = [];

    if (room?.roomId && room?.status !== 'recorded') {
      unsubscriber.push(observeInvitations(room));
    }

    return () => unsubscriber.forEach((fn) => fn());
  }, [room?.roomId]);

  return {
    invitations,
  };
};
