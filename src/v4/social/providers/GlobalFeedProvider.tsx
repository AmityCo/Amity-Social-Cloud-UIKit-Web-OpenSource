import React, { createContext, useContext, useState } from 'react';
import useGlobalPinnedPostsCollection from '~/v4/social/hooks/collections/useGlobalPinnedPostsCollection';
import type { FrameRatio } from '~/v4/social/features/posts/utils/getFrameRatio';

const useGlobalFeed = () => {
  const [newPosts, setNewPosts] = useState<Array<Amity.Post>>([]);
  const [postRatioOverrides, setPostRatioOverrides] = useState<Record<string, FrameRatio>>({});
  const [scrollPosition, setScrollPosition] = useState(0);

  const { globalFeaturedPosts, isLoading: isGlobalFeaturedPostsLoading } =
    useGlobalPinnedPostsCollection();

  const setPostRatioOverride = (postId: string, ratioOverride?: FrameRatio) => {
    if (!ratioOverride) return;
    setPostRatioOverrides((prev) => ({ ...prev, [postId]: ratioOverride }));
  };

  const prependNewPost = (post: Amity.Post, ratioOverride?: FrameRatio) => {
    setNewPosts((prev) => (prev.some((p) => p.postId === post.postId) ? prev : [post, ...prev]));
    setPostRatioOverride(post.postId, ratioOverride);
  };

  const removeNewPost = (postId: string) => {
    setNewPosts((prev) => prev.filter((p) => p.postId !== postId));
    setPostRatioOverrides((prev) => {
      const { [postId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const updateNewPost = (post: Amity.Post) => {
    setNewPosts((prev) => prev.map((p) => (p.postId === post.postId ? { ...p, ...post } : p)));
  };

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

  return {
    newPosts,
    postRatioOverrides,
    prependNewPost,
    setPostRatioOverride,
    removeNewPost,
    updateNewPost,
    globalFeaturedPostsItems: globalFeaturedPosts ?? [],
    isGlobalFeaturedPostsLoading,
    scrollPosition,
    onScroll,
  };
};

type GlobalFeedContextType = ReturnType<typeof useGlobalFeed>;

const GlobalFeedContext = createContext<GlobalFeedContextType>({
  newPosts: [],
  postRatioOverrides: {},
  prependNewPost: () => {},
  setPostRatioOverride: () => {},
  removeNewPost: () => {},
  updateNewPost: () => {},
  globalFeaturedPostsItems: [],
  isGlobalFeaturedPostsLoading: false,
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
