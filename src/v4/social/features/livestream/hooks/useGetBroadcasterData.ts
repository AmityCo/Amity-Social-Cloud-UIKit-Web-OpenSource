import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';

export interface UseGetBroadcasterDataReturn {
  getBroadcasterData: (roomId: string) => void;
  broadcasterData?: Amity.BroadcasterData;
  isPending: boolean;
  error?: unknown;
}

export const useGetBroadcasterData = (): UseGetBroadcasterDataReturn => {
  const {
    mutate: getBroadcasterData,
    isPending,
    data: broadcasterData,
    error,
  } = useMutation({
    mutationFn: async (roomId: string) => {
      return await RoomRepository.getBroadcasterData(roomId);
    },
  });

  return {
    getBroadcasterData,
    broadcasterData,
    isPending,
    error,
  };
};
