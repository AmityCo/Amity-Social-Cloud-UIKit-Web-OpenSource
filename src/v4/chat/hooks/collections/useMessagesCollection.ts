import { MessageRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseMessagesCollectionParams = Parameters<typeof MessageRepository.getMessages>[0];

export default function useMessagesCollection(
  params: UseMessagesCollectionParams,
  shouldFetch: boolean,
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Amity.Message[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>();

  const loadMoreRef = useRef<(() => void) | null>();

  const loadMore = useCallback(() => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
    }
  }, []);

  useEffect(() => {
    if (!params.subChannelId || !shouldFetch) return;

    const unsubscriber = MessageRepository.getMessages(
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

    return () => {
      unsubscriber();
    };
  }, [shouldFetch]);

  return {
    messages: items,
    loading: isLoading,
    hasMore,
    loadMore,
    error,
  };
}
