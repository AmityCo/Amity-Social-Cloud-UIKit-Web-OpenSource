import { useEffect, useRef } from 'react';
import { RoomRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import useSDK from '~/v4/core/hooks/useSDK';

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
      if (mode === 'host') {
        // Host subscribes to participantLeft + participantStageJoined
        // to distinguish "left the live stream" vs "left the stage (backstage)"
        unsubscriber.push(
          RoomRepository.onRoomParticipantLeft(({ actorInternalId }) => {
            const coHostInternalId = getRoomParticipant(room, 'coHost')?.userInternalId;
            if (coHostInternalId !== actorInternalId) return;
            if (coHostJoinedRef.current)
              success({
                content: 'Co-host left the live stream.',
                alignment: notificationAlignment,
              });
            else
              success({
                content: 'Co-host left the stage.',
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
      } else {
        // Viewer/co-host subscribes only to participantStageLeft
        // Co-host leaving stage triggers both participantLeft & participantStageLeft,
        // but viewers only care about stage left
        unsubscriber.push(
          RoomRepository.onRoomParticipantStageLeft(({ actorInternalId }) => {
            // If the current user is the co-host who's leaving, don't show toast
            if (currentUser?.userInternalId === actorInternalId) return;

            success({
              content: 'Co-host left the live stream.',
              alignment: notificationAlignment,
            });
          }),
        );
      }
    }

    return () => unsubscriber.forEach((fn) => fn());
  }, [room]);
}
