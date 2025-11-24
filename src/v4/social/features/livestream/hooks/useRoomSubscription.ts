import { getRoomWatcherTopic, subscribeTopic } from '@amityco/ts-sdk';
import { useEffect } from 'react';

export const useRoomSubscription = ({ room }: { room?: Amity.Room | null }) => {
  useEffect(() => {
    const unsubscriber: Amity.Unsubscriber[] = [];

    if (room?.roomId && room?.status !== 'recorded') {
      unsubscriber.push(subscribeTopic(getRoomWatcherTopic(room)));
    }

    return () => unsubscriber.forEach((fn) => fn());
  }, [room?.roomId]);

  return null;
};
