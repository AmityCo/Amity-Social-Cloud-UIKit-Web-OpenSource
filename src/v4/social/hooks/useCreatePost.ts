import { PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCreatePost = () => {
  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async (params: Parameters<typeof PostRepository.createPost>[0]) =>
      PostRepository.createPost(params),
  });

  return {
    createPost,
    isPending,
    isError,
  };
};
