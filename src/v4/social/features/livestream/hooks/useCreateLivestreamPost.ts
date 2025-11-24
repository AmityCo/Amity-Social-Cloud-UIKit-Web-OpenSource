import { PostRepository, RoomRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCreateLivestreamPost = () => {
  // Sequential mutation: create room then create post with roomId
  const {
    mutate: createLivestreamPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (
      params: Parameters<typeof RoomRepository.createRoom>[0] &
        Pick<Parameters<typeof PostRepository.createPost>[0], 'targetType' | 'targetId'>,
    ) => {
      const { targetType, targetId, ...roomParams } = params;

      // Step 1: Create the room
      const { data: room } = await RoomRepository.createRoom({ ...roomParams, type: 'coHosts' });

      // Step 2: Create the post with the room ID
      const post = await PostRepository.createPost({
        targetType,
        targetId,
        data: {
          text: roomParams.title + '\n\n' + roomParams.description,
          roomId: room.roomId,
        },
        dataType: 'room',
      });

      return { room, post };
    },
  });

  return {
    createLivestreamPost,
    isPending,
    isError,
  };
};
