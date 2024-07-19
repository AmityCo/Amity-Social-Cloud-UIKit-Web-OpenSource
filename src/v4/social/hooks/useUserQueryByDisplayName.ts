import { UserRepository } from '@amityco/ts-sdk';
import { useEffect, useRef, useState } from 'react';

const MINIMUM_STRING_LENGTH_TO_TRIGGER_QUERY = 1;

export const useUserQueryByDisplayName = (
  displayName: string,
  minLength: number = MINIMUM_STRING_LENGTH_TO_TRIGGER_QUERY,
) => {
  const [items, setItems] = useState<Amity.User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const loadMoreRef = useRef<(() => void) | null>(null);
  const unSubRef = useRef<(() => void) | null>(null);

  const loadMore = () => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
      setLoadMoreHasBeenCalled(true);
    }
  };

  useEffect(() => {
    if (displayName.length < minLength) return;

    if (unSubRef.current) {
      unSubRef.current();
      unSubRef.current = null;
    }

    const unSubFn = UserRepository.searchUserByDisplayName(
      { displayName, limit: 10 },
      (response) => {
        setHasMore(response.hasNextPage || false);
        setIsLoading(response.loading);
        loadMoreRef.current = response.onNextPage || null;
        setItems(response.data);
      },
    );
    unSubRef.current = unSubFn;

    return () => {
      unSubRef.current?.();
      unSubRef.current = null;
    };
  }, [displayName, minLength]);

  return {
    users: items,
    isLoading,
    hasMore,
    loadMore,
    loadMoreHasBeenCalled,
  };
};
