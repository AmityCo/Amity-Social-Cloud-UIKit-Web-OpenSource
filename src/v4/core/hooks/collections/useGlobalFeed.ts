import { FeedRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useState } from 'react';

const useGlobalFeed = () => {
  const [items, setItems] = useState<Amity.Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState<string | null>(null);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);

  async function fetchMore() {
    try {
      setIsLoading(true);
      const newPosts = await FeedRepository.getCustomRankingGlobalFeed({
        limit: 10,
        queryToken: queryToken || undefined,
      });
      setQueryToken(newPosts.paging.next || null);
      setItems((prevItems) => [...prevItems, ...newPosts.data]);
    } finally {
      setIsLoading(false);
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

  const loadMore = () => {
    setLoadMoreHasBeenCalled(true);
    if (hasMore) {
      fetchMore();
    }
  };

  const refetch = () => {
    setItems([]);
    setQueryToken(null);
    fetchMore();
  };

  return {
    posts: items,
    isLoading,
    prependItem,
    removeItem,
    loadMore,
    hasMore,
    loadMoreHasBeenCalled,
    refetch,
  };
};

export default useGlobalFeed;
