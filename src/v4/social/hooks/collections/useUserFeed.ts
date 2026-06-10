import { FeedRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

const QUERY_LIMIT = 20;

type UseUserFeedParams = Parameters<typeof FeedRepository.getUserFeed>[0];

export default function useUserFeed({ userId, limit = QUERY_LIMIT, ...params }: UseUserFeedParams) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: FeedRepository.getUserFeed,
    params: { userId, limit, ...params },
    shouldCall: !!userId,
  });

  // Audio children have no renderer in v4, so drop posts containing them. File
  // children now render (PostContent's FileContent), so file posts are kept.
  const filteredPosts = items.filter((post) => {
    const children = post.childrenPosts || [];
    const hasAudioChild = children.some((child) => child.dataType === 'audio');
    return !hasAudioChild;
  });

  return {
    ...rest,
    posts: filteredPosts,
  };
}
