import { PostRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UsePostProps = {
  postId: Parameters<typeof PostRepository.getPost>[0];
  shouldCall?: boolean;
};

export function usePost({ postId, shouldCall }: UsePostProps) {
  const {
    item: post,
    refresh,
    ...props
  } = useLiveObjectV4({
    fetcher: PostRepository.getPost,
    params: postId,
    shouldCall: !!postId && shouldCall !== false,
  });

  return { post, refresh, ...props };
}
