import { useEffect, useRef } from 'react';
import { RoomRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import useSDK from '~/v4/core/hooks/useSDK';
import { resolveString } from '~/v4/core/localization';

export function useCoHostParticipantEvents({
  room,
  notificationAlignment,
  mode,
}: {
  room?: Amity.Room | null;
  notificationAlignment: NotificationAlignment;
  mode: 'host' | 'viewer';
}) {
  const { success } = useNotifications();
  const { currentUser } = useSDK();
  const coHostJoinedRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscriber: Amity.Unsubscriber[] = [];
    if (room?.status === 'live') {
      const coHostInternalId = getRoomParticipant(room, 'coHost')?.userInternalId;
      unsubscriber.push(
        RoomRepository.onRoomParticipantLeft(({ actorInternalId }) => {
          if (
            coHostInternalId !== actorInternalId ||
            currentUser?.userInternalId === actorInternalId
          )
            return;

          if (coHostJoinedRef.current || mode === 'viewer')
            success({
              content: resolveString('amity_social_status_cohost_left'),
              alignment: notificationAlignment,
            });
          else
            success({
              content: resolveString('amity_social_co_host_left_the_stage'),
              alignment: notificationAlignment,
            });

          coHostJoinedRef.current = false;
        }),
      );

      unsubscriber.push(
        RoomRepository.onRoomParticipantStageJoined(({ room }) => {
          if (getRoomParticipant(room, 'coHost')) coHostJoinedRef.current = true;
        }),
      );
    }

    return () => unsubscriber.forEach((fn) => fn());
  }, [room]);
}
