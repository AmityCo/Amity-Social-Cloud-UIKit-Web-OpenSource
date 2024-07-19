import React, { useRef } from 'react';
import { PostContent, PostContentSkeleton } from '../PostContent';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed/EmptyNewsFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

import styles from './GlobalFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostAd } from '~/v4/social/internal-components/PostAd/PostAd';

interface GlobalFeedProps {
  pageId?: string;
  componentId?: string;
  items: Array<Amity.Post | Amity.Ad>;
  isLoading: boolean;
  onFeedReachBottom: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
}

const isAmityAd = (item: Amity.Post | Amity.Ad): item is Amity.Ad => {
  return (item as Amity.Ad)?.adId !== undefined;
};

export const GlobalFeed = ({
  pageId = '*',
  componentId = '*',
  items,
  isLoading,
  onFeedReachBottom,
  onPostDeleted,
}: GlobalFeedProps) => {
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const intersectionRef = useRef<HTMLDivElement>(null);

  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();

  useIntersectionObserver({
    ref: intersectionRef,
    onIntersect: () => {
      onFeedReachBottom();
    },
  });

  if (items.length === 0 && !isLoading) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  const getItemKey = (item: Amity.Post | Amity.Ad, prevItem: Amity.Post | Amity.Ad | undefined) => {
    if (isAmityAd(item)) {
      if (prevItem && isAmityAd(prevItem)) {
        return `${prevItem.adId}-${item.adId}`;
      } else {
        return `${prevItem.postId}-${item.adId}`;
      }
    }
    return item.postId;
  };

  return (
    <div className={styles.global_feed} style={themeStyles} data-qa-anchor={accessibilityId}>
      {items.map((item, index) => (
        <div key={getItemKey(item, items[Math.max(0, index - 1)])}>
          {index !== 0 ? <div className={styles.global_feed__divider} /> : null}
          {isAmityAd(item) ? (
            <PostAd ad={item} />
          ) : (
            <div className={styles.global_feed__postContainer}>
              <PostContent
                pageId={pageId}
                post={item}
                type="feed"
                onClick={() => {
                  AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({ postId: item.postId });
                }}
                onPostDeleted={onPostDeleted}
              />
            </div>
          )}
        </div>
      ))}
      {isLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <div className={styles.global_feed__divider} />
              <div className={styles.global_feed__postSkeletonContainer}>
                <PostContentSkeleton />
              </div>
            </div>
          ))
        : null}
      {!isLoading && <div ref={intersectionRef} className={styles.global_feed__intersection} />}
    </div>
  );
};
