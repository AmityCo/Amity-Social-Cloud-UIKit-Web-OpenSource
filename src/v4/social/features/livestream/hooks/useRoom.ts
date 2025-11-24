import { RoomRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

export const useRoom = (roomId?: string) => {
  const [room, setRoom] = useState<Amity.Room | null>(null);

  useEffect(() => {
    if (roomId == null) return;

    const unsubscribe = RoomRepository.getRoom(roomId, ({ data }) => {
      setRoom(data);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  return {
    room,
    hostId: room?.participants.find((participant) => participant.type === 'host')?.userId,
    coHostId: room?.participants.find((participant) => participant.type === 'coHost')?.userId,
  };
};
