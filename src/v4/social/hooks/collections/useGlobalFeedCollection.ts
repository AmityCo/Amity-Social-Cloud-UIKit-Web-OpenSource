import { FeedRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type UseGlobalFeedCollectionOptions = {
  shouldCall?: boolean;
};

export function useGlobalFeedCollection({
  shouldCall = true,
}: UseGlobalFeedCollectionOptions = {}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: FeedRepository.getGlobalFeed,
    params: { limit: 10 },
    shouldCall,
  });

  return {
    posts: items,
    ...rest,
  };
}
