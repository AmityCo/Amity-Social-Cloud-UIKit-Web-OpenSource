import React, { createContext, useContext, useState, useMemo } from 'react';
import { FeedRepository, PostRepository } from '@amityco/ts-sdk';
import { usePaginatorApi } from '~/v4/core/hooks/usePaginator';
import { isNonNullable } from '~/v4/helpers/utils';

const useGlobalFeed = () => {
  const [items, setItems] = useState<Array<Amity.Post>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState<string | null>(null);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const [hasBeenFetched, setHasBeenFetched] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const limit = 10;

  const { itemWithAds, reset } = usePaginatorApi({
    items: items,
    pageSize: limit,
    placement: 'feed' as Amity.AdPlacement,
    getItemId: (item) => item.postId,
  });

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

  async function fetchMore() {
    try {
      setIsLoading(true);
      const newPosts = await FeedRepository.getCustomRankingGlobalFeed({
        limit: 10,
        queryToken: queryToken || undefined,
      });

      const filteredPosts = (
        await Promise.all(
          newPosts.data.map(async (post: Amity.Post) => {
            if (post?.children?.length > 0) {
              let unsub = () => {};
              const childPost = await new Promise<Amity.Post>((resolve) => {
                unsub = PostRepository.getPost(post.children[0], (response) => {
                  return resolve(response.data);
                });
              });
              unsub();
              if (!childPost) {
                return post;
              }
              if (['liveStream', 'poll', 'file'].includes(childPost.dataType)) {
                return null;
              }
              return post;
            }
            return post;
          }),
        )
      ).filter(isNonNullable);

      setQueryToken(newPosts.paging.next || null);
      setItems((prev) => [...prev, ...filteredPosts]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

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

  const updateItem = (post: Amity.Post) => {
    const newItems = items.map((item) => {
      if (item.postId === post.postId) {
        return { ...item, ...post };
      }
      return item;
    });
    setItems(newItems);
  };

  const hasMore = useMemo(() => queryToken !== null, [queryToken]);

  const loadMore = () => {
    setLoadMoreHasBeenCalled(true);
    if (isLoading) return;
    if (hasMore) {
      fetchMore();
    }
  };

  const fetch = () => {
    if (hasBeenFetched) return;
    refetch();
    setHasBeenFetched(true);
  };

  const refetch = () => {
    setItems([]);
    setQueryToken(null);
    fetchMore();
    reset();
  };

  return {
    itemWithAds,
    isLoading,
    prependItem,
    removeItem,
    updateItem,
    loadMore,
    hasMore,
    loadMoreHasBeenCalled,
    fetch,
    refetch,
    scrollPosition,
    onScroll,
  };
};

type GlobalFeedContextType = ReturnType<typeof useGlobalFeed>;

const GlobalFeedContext = createContext<GlobalFeedContextType>({
  itemWithAds: [],
  isLoading: false,
  prependItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  loadMore: () => {},
  hasMore: false,
  loadMoreHasBeenCalled: false,
  fetch: () => {},
  refetch: () => {},
  scrollPosition: 0,
  onScroll: () => {},
});

export const useGlobalFeedContext = () => {
  const context = useContext(GlobalFeedContext);
  if (!context) {
    throw new Error('useGlobalFeedContext must be used within a GlobalFeedProvider');
  }
  return context;
};

type GlobalFeedProviderProps = {
  children: React.ReactNode;
};

export const GlobalFeedProvider: React.FC<GlobalFeedProviderProps> = ({ children }) => {
  const value = useGlobalFeed();

  return <GlobalFeedContext.Provider value={value}>{children}</GlobalFeedContext.Provider>;
};
