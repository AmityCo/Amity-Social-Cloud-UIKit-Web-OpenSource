import { RoomRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';

export const useStopStream = () => {
  // Sequential mutation: create room then create post with roomId
  const {
    mutate: stopStream,
    isPending,
    isError,
  } = useMutation({
    mutationFn: RoomRepository.stopRoom,
  });

  return {
    stopStream,
    isPending,
    isError,
  };
};
