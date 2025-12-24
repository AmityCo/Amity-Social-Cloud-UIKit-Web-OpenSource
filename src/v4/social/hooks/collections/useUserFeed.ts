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

  // Filter out posts with children type 'file' or 'audio'
  const filteredPosts = items.filter((post) => {
    const children = post.childrenPosts || [];
    const hasFileOrAudioChild = children.some(
      (child) => child.dataType === 'file' || child.dataType === 'audio',
    );
    return !hasFileOrAudioChild;
  });

  return {
    ...rest,
    posts: filteredPosts,
  };
}
