import { PostRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

const usePost = (postId?: string) => {
  const { item, ...rest } = useLiveObject({
    fetcher: PostRepository.getPost,
    params: postId as string,
    shouldCall: () => !!postId,
  });

  return {
    post: item,
    ...rest,
  };
};

export default usePost;
