import { FeedRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';
import { withoutUnsupportedMediaPosts } from '~/v4/social/utils/isUnsupportedMediaPost';

type UseForYouFeedCollectionOptions = {
  shouldCall?: boolean;
};

export function useForYouFeedCollection({
  shouldCall = true,
}: UseForYouFeedCollectionOptions = {}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: FeedRepository.getForYouFeed,
    shouldCall,
  });

  return {
    posts: withoutUnsupportedMediaPosts(items),
    ...rest,
  };
}
