import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

const QUERY_LIMIT = 20;

export default function usePostsCollection({
  targetType,
  targetId,
  feedType,
  dataTypes,
  limit = QUERY_LIMIT,
}: Partial<Parameters<typeof PostRepository.getPosts>[0]>) {
  const { items, ...rest } = useLiveCollection({
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
