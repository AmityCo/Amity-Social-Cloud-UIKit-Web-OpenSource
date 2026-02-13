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
        Pick<
          Parameters<typeof PostRepository.createRoomPost>[0],
          'targetType' | 'targetId' | 'productTags' | 'pinnedProductId'
        >,
    ) => {
      const { targetType, targetId, productTags, pinnedProductId, ...roomParams } = params;

      // Step 1: Create the room
      const { data: room } = await RoomRepository.createRoom({ ...roomParams, type: 'coHosts' });

      // Step 2: Create the post with the room ID
      const post = await PostRepository.createRoomPost({
        targetType,
        targetId,
        data: {
          title: roomParams.title,
          text: roomParams.description,
          roomId: room.roomId,
        },
        productTags,
        pinnedProductId,
      });

      return { room, post, productTags };
    },
  });

  return {
    createLivestreamPost,
    isPending,
    isError,
  };
};
