import React, { useEffect, useRef, useState } from 'react';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed';
import { GlobalFeed } from '~/v4/social/components/GlobalFeed';

import styles from './Newsfeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { RefreshSpinner } from '~/v4/icons/RefreshSpinner';

interface NewsfeedProps {
  pageId?: string;
}

export const Newsfeed = ({ pageId = '*' }: NewsfeedProps) => {
  const componentId = 'newsfeed';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);

  const { itemWithAds, hasMore, isLoading, loadMore, fetch, refetch, removeItem } =
    useGlobalFeedContext();

  useEffect(() => {
    fetch();
  }, []);

  const onFeedReachBottom = () => {
    if (hasMore && !isLoading) loadMore();
  };

  if (itemWithAds.length === 0 && !isLoading) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  return (
    <div
      className={styles.newsfeed}
      style={themeStyles}
      onDrag={(event) => event.stopPropagation()}
      onTouchStart={(ev) => {
        touchStartY.current = ev.touches[0].clientY;
      }}
      onTouchMove={(ev) => {
        const touchY = ev.touches[0].clientY;

        if (touchStartY.current > touchY) {
          return;
        }

        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
      }}
      onTouchEnd={(ev) => {
        touchStartY.current = 0;
        if (touchDiff >= 75) {
          refetch();
        }
        setTouchDiff(0);
      }}
    >
      <div
        style={
          {
            '--asc-pull-to-refresh-height': `${touchDiff}px`,
          } as React.CSSProperties
        }
        className={styles.newsfeed__pullToRefresh}
      >
        <RefreshSpinner className={styles.newsfeed__pullToRefresh__spinner} />
      </div>
      <div className={styles.newsfeed__divider} />
      <StoryTab type="globalFeed" pageId={pageId} />
      {itemWithAds.length > 0 && <div className={styles.newsfeed__divider} />}
      <GlobalFeed
        isLoading={isLoading}
        items={itemWithAds}
        pageId={pageId}
        componentId={componentId}
        onFeedReachBottom={() => onFeedReachBottom()}
        onPostDeleted={(post) => removeItem(post.postId)}
      />
    </div>
  );
};
