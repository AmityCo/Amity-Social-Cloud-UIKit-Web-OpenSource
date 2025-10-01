import { JoinRequestStatusEnum } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';

type useJoinRequestsCollectionParams = {
  community: Amity.Community;
  status?: Amity.JoinRequestStatus;
};
export default function useJoinRequestsCollection({
  community,
  status = JoinRequestStatusEnum.Pending,
}: useJoinRequestsCollectionParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Amity.JoinRequest[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>();

  const { isVisitorOrBot } = useSDK();
  const loadMoreRef = useRef<(() => void) | null>();
  const unsubscriberRef = useRef<(() => void) | null>(null);

  const loadMore = useCallback(() => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
    }
  }, []);

  const subscribe = useCallback(() => {
    if (!community.communityId || isVisitorOrBot) return;

    const unsubscriber = community.getJoinRequests(
      {
        communityId: community.communityId,
        type: 'communityJoinRequest',
        targetType: 'community',
        status,
        options: {
          limit: 20,
        },
      },
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
  }, [community.communityId, status]);

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
    joinRequests: items,
    loading: isLoading,
    hasMore,
    loadMore,
    refresh,
    error,
  };
}
