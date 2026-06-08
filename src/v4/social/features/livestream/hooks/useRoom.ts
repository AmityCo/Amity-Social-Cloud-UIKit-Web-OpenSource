import { RoomRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

export const useRoom = (roomId?: string) => {
  const { item: room, ...rest } = useLiveObjectV4({
    fetcher: RoomRepository.getRoom,
    params: roomId as string,
    shouldCall: !!roomId,
  });

  return {
    room,
    hostId: room?.participants.find((participant) => participant.type === 'host')?.userId,
    coHostId: room?.participants.find((participant) => participant.type === 'coHost')?.userId,
    ...rest,
  };
};
