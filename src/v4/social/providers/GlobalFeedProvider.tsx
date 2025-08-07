import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FeedRepository, PostStructureType } from '@amityco/ts-sdk';
import { usePaginatorApi } from '~/v4/core/hooks/usePaginator';
import useGlobalPinnedPostsCollection from '~/v4/social/hooks/collections/useGlobalPinnedPostsCollection';

const useGlobalFeed = () => {
  const [items, setItems] = useState<Array<Amity.Post>>([]);
  const [globalFeaturedPostsItems, setGlobalFeaturedPostsItems] = useState<Array<Amity.PinnedPost>>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const onNextPageRef = useRef<(() => void) | undefined>();
  const unsubscriberRef = useRef<(() => void) | undefined>();

  const limit = 10;

  const { itemWithAds, reset } = usePaginatorApi({
    items: items,
    pageSize: limit,
    placement: 'feed' as Amity.AdPlacement,
    getItemId: (item) => item.postId,
  });

  const { globalFeaturedPosts, isLoading: isGlobalFeaturedPostsLoading } =
    useGlobalPinnedPostsCollection();

  useEffect(() => {
    if (globalFeaturedPosts) {
      setGlobalFeaturedPostsItems(globalFeaturedPosts);
    }
  }, [globalFeaturedPosts?.length]);

  const fetch = useCallback(() => {
    const unsubscriber = FeedRepository.getGlobalFeed(
      {
        limit,
      },
      ({ data, loading, error, hasNextPage, onNextPage }) => {
        setIsLoading(loading);

        if (data && !loading) {
          setHasNextPage(!!hasNextPage);
          onNextPageRef.current = onNextPage;
          setItems(
            data.filter(
              (post) =>
                post.structureType !== PostStructureType.AUDIO &&
                post.structureType !== PostStructureType.FILE &&
                post.structureType !== PostStructureType.MIXED,
            ),
          );
        }
        if (error) {
          console.error('error', error);
        }
      },
    );

    unsubscriberRef.current = unsubscriber;
    return unsubscriber;
  }, []);

  useEffect(() => {
    const unsubscriber = fetch();

    return () => {
      unsubscriber();
    };
  }, [fetch]);

  const refetch = async () => {
    // Cleanup current subscription
    if (unsubscriberRef.current) {
      unsubscriberRef.current();
    }

    // Reset state
    setItems([]);
    setHasNextPage(false);
    onNextPageRef.current = undefined;
    reset();

    // Small delay to ensure cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Setup new subscription
    fetch();
  };

  const fetch = useCallback(() => {
    const unsubscriber = FeedRepository.getGlobalFeed(
      {
        limit,
      },
      ({ data, loading, error, hasNextPage, onNextPage }) => {
        setIsLoading(loading);

        if (data && !loading) {
          setHasNextPage(!!hasNextPage);
          onNextPageRef.current = onNextPage;
          setItems(data);
        }
        if (error) {
          console.error('error', error);
        }
      },
    );

    unsubscriberRef.current = unsubscriber;
    return unsubscriber;
  }, []);

  useEffect(() => {
    const unsubscriber = fetch();

    return () => {
      unsubscriber();
    };
  }, [fetch]);

  const refetch = useCallback(async () => {
    // Cleanup current subscription
    if (unsubscriberRef.current) {
      unsubscriberRef.current();
    }

    // Reset state
    setItems([]);
    setHasNextPage(false);
    onNextPageRef.current = undefined;
    reset();

    // Small delay to ensure cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Setup new subscription
    fetch();
  }, [fetch, reset]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

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

  const updateGlobalFeaturedPosts = (incomingPost: Amity.Post, isPostNeedsApproval?: boolean) => {
    if (!globalFeaturedPosts) return;

    if (isPostNeedsApproval) {
      const newItems = globalFeaturedPosts.filter(
        (item) => item.post?.postId !== incomingPost.postId,
      );
      setGlobalFeaturedPostsItems(newItems);
    } else {
      const newItems = globalFeaturedPosts.map((item) => {
        if (item.post?.postId === incomingPost.postId) {
          return { ...item, post: { ...item.post, ...incomingPost } };
        }
        return item;
      });
      setGlobalFeaturedPostsItems(newItems);
    }
  };

  const loadMore = useCallback(() => {
    if (onNextPageRef.current) {
      onNextPageRef.current();
    }
  }, []);

  return {
    itemWithAds,
    isLoading,
    prependItem,
    removeItem,
    updateItem,
    updateGlobalFeaturedPosts,
    globalFeaturedPostsItems,
    loadMore,
    hasMore: hasNextPage,
    loadMoreHasBeenCalled,
    refetch,
    scrollPosition,
    onScroll,
    isGlobalFeaturedPostsLoading,
  };
};

type GlobalFeedContextType = ReturnType<typeof useGlobalFeed>;

const GlobalFeedContext = createContext<GlobalFeedContextType>({
  itemWithAds: [],
  isLoading: false,
  prependItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  updateGlobalFeaturedPosts: () => {},
  loadMore: () => {},
  hasMore: false,
  loadMoreHasBeenCalled: false,
  refetch: () => Promise.resolve(),
  scrollPosition: 0,
  onScroll: () => {},
  isGlobalFeaturedPostsLoading: false,
  globalFeaturedPostsItems: [],
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
