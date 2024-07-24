import { FeedRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useState } from 'react';

const useFeed = () => {
  const [items, setItems] = useState<Amity.Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState<number | null>(null);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);

  async function fetchMore() {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const newPosts = await FeedRepository.queryGlobalFeed({
        limit: 10,
        queryToken: queryToken || undefined,
      });
      setQueryToken(newPosts.paging.next || null);
      setItems((prevItems: Amity.Post[]) => {
        const currentItemIds = new Set([...prevItems.map((item) => item.postId)]);
        return [
          ...prevItems,
          ...newPosts.data.filter((item: Amity.Post) => !currentItemIds.has(item.postId)),
        ];
      });
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
    setItems((prevItems) => {
      const currentItemIds = new Set([...prevItems.map((item) => item.postId)]);
      if (!currentItemIds.has(post.postId)) {
        return [post, ...prevItems];
      }
      return prevItems;
    });
  };

  const removeItem = (postId: string) => {
    const newItems = items.filter((item) => item.postId !== postId);
    setItems(newItems);
  };

  const hasMore = useMemo(() => queryToken !== null, [queryToken]);

  const loadMore = () => {
    setLoadMoreHasBeenCalled(true);
    if (hasMore && !isLoading) {
      fetchMore();
    }
  };

  return {
    contents: items,
    isLoading,
    prependItem,
    removeItem,
    loadMore,
    hasMore,
    loadMoreHasBeenCalled,
  };
};

export default useFeed;
