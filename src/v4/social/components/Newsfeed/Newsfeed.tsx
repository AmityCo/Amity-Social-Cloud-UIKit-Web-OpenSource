import React, { useEffect } from 'react';
import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { GlobalFeed } from '~/v4/social/components/GlobalFeed';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import styles from './Newsfeed.module.css';

type NewsfeedProps = {
  pageId?: string;
};

export const Newsfeed = ({ pageId = '*' }: NewsfeedProps) => {
  const componentId = 'newsfeed';

  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const {
    itemWithAds,
    hasMore,
    isLoading,
    globalFeaturedPostsItems,
    isGlobalFeaturedPostsLoading,
    loadMore,
    refetch,
    removeItem,
  } = useGlobalFeedContext();

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading) loadMore?.();
  };

  if (itemWithAds.length === 0 && !isLoading) return <EmptyNewsfeed pageId={pageId} />;

  return (
    <PullToRefresh className={styles.newsfeed} style={themeStyles} onTouchEndCallback={refetch}>
      <Divider />
      <StoryTab type="globalFeed" pageId={pageId} />
      <Divider />
      <PostComposer pageId={pageId} />
      <GlobalFeed
        pageId={pageId}
        items={itemWithAds}
        isLoading={isLoading}
        componentId={componentId}
        onFeedReachBottom={() => onFeedReachBottom()}
        onPostDeleted={(post) => {
          if (post && post.postId) {
            removeItem(post.postId);
          }
        }}
        globalFeaturedPosts={globalFeaturedPostsItems}
        isGlobalFeaturedPostsLoading={isGlobalFeaturedPostsLoading}
      />
    </PullToRefresh>
  );
};
