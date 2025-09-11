import { PostRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

const QUERY_LIMIT = 20;

export default function usePostsCollection({
  targetType,
  targetId,
  feedType,
  dataTypes,
  limit = QUERY_LIMIT,
}: Partial<Parameters<typeof PostRepository.getPosts>[0]>) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: PostRepository.getPosts,
    params: {
      targetType,
      targetId: targetId as string,
      feedType,
      dataTypes,
      limit,
    },
    shouldCall: !!targetId && !!targetType,
  });

  return {
    posts: items,
    ...rest,
  };
}
