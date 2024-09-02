import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

const QUERY_LIMIT = 10;

export default function usePostsCollection({
  targetType,
  targetId,
  feedType,
  limit = QUERY_LIMIT,
}: Partial<Parameters<typeof PostRepository.getPosts>[0]>) {
  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getPosts,
    params: {
      targetType,
      targetId: targetId as string,
      feedType,
      limit,
    },
    shouldCall: !!targetId && !!targetType,
  });

  return {
    posts: items,
    ...rest,
  };
}
