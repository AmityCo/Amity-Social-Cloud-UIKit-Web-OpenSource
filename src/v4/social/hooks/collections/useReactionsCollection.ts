import { ReactionRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseReactionsCollectionParams = Parameters<typeof ReactionRepository.getReactions>[0];

export const useReactionsCollection = (params: UseReactionsCollectionParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<Amity.Reactor[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>();

  const loadMoreRef = useRef<(() => void) | null>();
  const unsubscriberRef = useRef<(() => void) | null>(null);

  const loadMore = useCallback(() => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
    }
  }, []);

  const subscribe = useCallback(() => {
    if (!params.referenceId || !params.referenceType) return;

    const unsubscriber = ReactionRepository.getReactions(
      params,
      ({ data, loading, error, hasNextPage, onNextPage }) => {
        setIsLoading(loading);

        if (!loading && data) {
          setItems([...data]);
          setHasMore(hasNextPage);
          loadMoreRef.current = hasNextPage ? onNextPage : null;
        }

        if (error) setError(error);
      },
    );

    unsubscriberRef.current = unsubscriber;
    return unsubscriber;
  }, [params.referenceId, params.referenceType]);

  const refresh = useCallback(() => {
    if (unsubscriberRef.current) {
      unsubscriberRef.current();
    }
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

  return {
    reactions: items,
    loading: isLoading,
    hasMore,
    loadMore,
    refresh,
    error,
  };
};
