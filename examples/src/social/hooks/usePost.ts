import { PostRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const usePost = (postId?: string): Amity.Post | null | undefined => {
  const post: Amity.Post | null | undefined = useLiveObject({
    fetcher: PostRepository.getPost,
    params: postId as string,
    shouldCall: () => !!postId,
  });

  return post as Amity.Post | null | undefined;
};

export default usePost;
