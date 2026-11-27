import { FeedRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';
import { withoutUnsupportedMediaPosts } from '~/v4/social/utils/isUnsupportedMediaPost';

const QUERY_LIMIT = 20;

type UseUserFeedParams = Parameters<typeof FeedRepository.getUserFeed>[0];

export default function useUserFeed(
  { userId, limit = QUERY_LIMIT, ...params }: UseUserFeedParams,
  // A caller whose own module is off cannot skip this hook — React counts them —
  // so it says so here and no request goes out.
  enabled = true,
) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: FeedRepository.getUserFeed,
    params: { userId, limit, ...params },
    shouldCall: enabled && !!userId,
  });

  const filteredPosts = withoutUnsupportedMediaPosts(items);

  return {
    ...rest,
    posts: filteredPosts,
  };
}
