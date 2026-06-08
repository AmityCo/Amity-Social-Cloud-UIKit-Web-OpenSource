import { PostRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

const usePost = (postId?: string, shouldCall?: boolean) => {
  const { item, isLoading, refresh, ...rest } = useLiveObjectV4({
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
