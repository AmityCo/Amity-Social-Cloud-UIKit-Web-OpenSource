import { CommunityRepository } from '@amityco/ts-sdk';
import { useEffect, useRef, useState } from 'react';

export const useMemberQueryByDisplayName = ({
  communityId,
  displayName,
  limit,
  enabled = true,
}: {
  communityId: string;
  displayName: string;
  limit: number;
  enabled?: boolean;
}) => {
  const [items, setItems] = useState<Amity.Membership<'community'>[]>([]);
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
    if (!enabled) return;

    if (unSubRef.current) {
      unSubRef.current();
      unSubRef.current = null;
    }

    const unSubFn = CommunityRepository.Membership.searchMembers(
      {
        communityId,
        search: displayName,
        limit,
        sortBy: 'displayName',
        includeDeleted: false,
      },
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
  }, [communityId, displayName, enabled]);

  return {
    members: items,
    isLoading,
    hasMore,
    loadMore,
    loadMoreHasBeenCalled,
  };
};
