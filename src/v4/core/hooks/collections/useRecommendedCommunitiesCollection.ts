import { CommunityRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

type useRecommendedCommunitiesCollectionParams = {
  params: Parameters<typeof CommunityRepository.getRecommendedCommunities>[0];
  enabled?: boolean;
};

export function useRecommendedCommunitiesCollection({
  params,
  enabled = true,
}: useRecommendedCommunitiesCollectionParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<Amity.Community[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>();

  const loadMoreRef = useRef<(() => void) | null>();
  const unsubscriberRef = useRef<(() => void) | null>(null);

  const loadMore = useCallback(() => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
    }
  }, []);

  const subscribe = useCallback(() => {
    if (!enabled) return;

    const unsubscriber = CommunityRepository.getRecommendedCommunities(
      params,
      ({ data, loading, error, hasNextPage, onNextPage }) => {
        setIsLoading(loading);

        if (!loading && data) {
          setItems((prevItems) => {
            // If this is the first load or a refresh, replace the data
            // Otherwise, accumulate the data
            if (!prevItems || prevItems.length === 0) {
              return [...data];
            }
            // Merge new data with existing, avoiding duplicates
            const existingIds = new Set(prevItems.map((item) => item.communityId));
            const newItems = data.filter((item) => !existingIds.has(item.communityId));
            return [...prevItems, ...newItems];
          });
          setHasMore(hasNextPage);
          loadMoreRef.current = hasNextPage ? onNextPage : null;
        }

        if (error) setError(error);
      },
    );

    unsubscriberRef.current = unsubscriber;
    return unsubscriber;
  }, [enabled, JSON.stringify(params)]);

  const refresh = useCallback(() => {
    if (unsubscriberRef.current) {
      unsubscriberRef.current();
    }
    // Reset items to null to ensure fresh data on refresh
    setItems(null);
    setIsLoading(true);
    subscribe();
  }, [subscribe]);

  useEffect(() => {
    subscribe();

    return () => {
      if (unsubscriberRef.current) {
        unsubscriberRef.current();
      }
    };
  }, [subscribe]);

  useEffect(() => {
    if (!isLoading && items && hasMore && items.length > 0) {
      const filteredCommunities = items.slice(0, 5); // Limit to maximum 5 items

      // Load more if we have less than 10 filtered communities to ensure enough for component filtering
      if (filteredCommunities.length < 10 && loadMoreRef.current) {
        loadMoreRef.current();
      }
    }
  }, [items, isLoading, hasMore]);

  return {
    recommendedCommunities: items,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
