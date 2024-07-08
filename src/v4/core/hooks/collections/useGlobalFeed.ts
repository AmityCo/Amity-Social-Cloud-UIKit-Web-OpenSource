import { FeedRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePaginatorApi } from '../usePagination';

export const useGlobalFeed = () => {
  const [items, setItems] = useState<Array<Amity.Post | Amity.Ad>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState<string | null>(null);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const limit = 10;

  const { itemWithAds } = usePaginatorApi({
    items: items,
    pageSize: limit,
    placement: 'feed' as Amity.AdPlacement,
    getItemId: (item) => item.postId,
  });

  async function fetchMore() {
    try {
      setIsLoading(true);
      const newPosts = await FeedRepository.getCustomRankingGlobalFeed({
        limit: 10,
        queryToken: queryToken || undefined,
      });
      setQueryToken(newPosts.paging.next || null);
      setItems((prev) => [...prev, ...newPosts.data]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  useEffect(() => {
    fetchMore();

    return () => {
      setItems([]);
      setQueryToken(null);
    };
  }, []);

  const prependItem = (post: Amity.Post) => {
    setItems((prevItems) => [post, ...prevItems]);
  };

  const removeItem = (postId: string) => {
    const newItems = items.filter((item) => item.postId !== postId);
    setItems(newItems);
  };

  const hasMore = useMemo(() => queryToken !== null, [queryToken]);

  const loadMore = useCallback(() => {
    setLoadMoreHasBeenCalled(true);
    if (isLoading) return;
    if (hasMore) {
      fetchMore();
    }
  }, [isLoading, hasMore, fetchMore]);

  const refetch = () => {
    setItems([]);
    setQueryToken(null);
    fetchMore();
  };

  return {
    itemWithAds,
    isLoading,
    prependItem,
    removeItem,
    loadMore,
    hasMore,
    loadMoreHasBeenCalled,
    refetch,
  };
};
