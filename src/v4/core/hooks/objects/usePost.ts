import { PostRepository } from '@amityco/ts-sdk';
import useLiveObject from '~/v4/core/hooks/useLiveObject';

const usePost = (postId?: string, shouldCall?: boolean) => {
  const { item, isLoading, refresh, ...rest } = useLiveObject({
    fetcher: PostRepository.getPost,
    params: postId as string,
    shouldCall: shouldCall ?? !!postId,
  });

  return {
    post: item,
    isLoading,
    refresh,
    ...rest,
  };
};

export default usePost;
