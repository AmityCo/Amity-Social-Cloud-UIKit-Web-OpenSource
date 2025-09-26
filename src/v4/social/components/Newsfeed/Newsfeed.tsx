import React, { useEffect, useState } from 'react';
import { Divider } from '~/v4/social/elements/Divider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { GlobalFeed } from '~/v4/social/components/GlobalFeed';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { SocialGlobalSearchPage } from '~/v4/social/pages/SocialGlobalSearchPage';
import styles from './Newsfeed.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type NewsfeedProps = {
  pageId?: string;
};

export const Newsfeed = ({ pageId = '*' }: NewsfeedProps) => {
  const componentId = 'newsfeed';
  const [showSearch, setShowSearch] = useState(false);
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

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  if (itemWithAds.length === 0 && !isLoading) return <EmptyNewsfeed pageId={pageId} />;

  return (
    <PullToRefresh className={styles.newsfeed} style={themeStyles} onTouchEndCallback={refetch}>
      <PostComposer pageId={pageId} onSearchClick={handleSearchClick} />
      {showSearch ? (
        <div className={styles.newsFeed__cardBorders}>
          <SocialGlobalSearchPage />
        </div>
      ) : (
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
      )}

    </PullToRefresh>
  );
};
