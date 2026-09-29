import { PostRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

const usePost = (postId?: string, shouldCall?: boolean) => {
  const { item, isLoading, refresh, ...rest } = useLiveObjectV4({
    fetcher: PostRepository.getPost,
    params: postId as string,
    // A caller passing `shouldCall` used to replace the id check rather than add
    // to it, so `usePost(undefined, true)` asked the backend for
    // `/api/v3/posts/undefined`. The clip feed does exactly that while it is
    // still resolving which clip is current. An explicit `false` still wins.
    shouldCall: shouldCall !== false && !!postId,
  });

  return {
    post: item,
    isLoading,
    refresh,
    ...rest,
  };
};

export default usePost;
