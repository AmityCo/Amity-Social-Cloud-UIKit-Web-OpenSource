import { PostRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';
import { withoutUnsupportedMediaPosts } from '~/v4/social/utils/isUnsupportedMediaPost';

const QUERY_LIMIT = 20;

type UsePostsCollectionParams = Partial<Parameters<typeof PostRepository.getPosts>[0]>;

export default function usePostsCollection(
  { targetType, targetId, limit = QUERY_LIMIT, ...props }: UsePostsCollectionParams,
  // A caller whose own module is off cannot skip this hook — React counts them —
  // so it says so here and no request goes out.
  enabled = true,
) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: PostRepository.getPosts,
    params: {
      targetId: targetId ?? '',
      targetType,
      limit,
      ...props,
    },
    shouldCall: enabled && !!targetId && !!targetType,
  });

  const filteredPosts = withoutUnsupportedMediaPosts(items);

  return {
    posts: filteredPosts,
    ...rest,
  };
}
