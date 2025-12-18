import React from 'react';
import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { GlobalFeed } from '~/v4/social/components/GlobalFeed';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import styles from './Newsfeed.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

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

  const { isDesktop } = useResponsive();

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading) loadMore?.();
  };

  if (itemWithAds.length === 0 && !isLoading && globalFeaturedPostsItems.length === 0)
    return <EmptyNewsfeed pageId={pageId} />;

  return (
    <PullToRefresh className={styles.newsfeed} style={themeStyles} onTouchEndCallback={refetch}>
      <Divider isShown={!isDesktop} />
      <div className={styles.newsfeed__storyTab}>
        <StoryTab type="globalFeed" pageId={pageId} />
      </div>
      <Divider isShown={!isDesktop} />
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
