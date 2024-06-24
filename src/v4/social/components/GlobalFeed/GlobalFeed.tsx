import React, { useRef } from 'react';
import { PostContent, PostContentSkeleton } from '../PostContent';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed/EmptyNewsFeed';
import useGlobalFeed from '~/v4/core/hooks/collections/useGlobalFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

import styles from './GlobalFeed.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface GlobalFeedProps {
  pageId?: string;
  componentId?: string;
  posts: Amity.Post[];
  isLoading: boolean;
  onFeedReachBottom: () => void;
}

export const GlobalFeed = ({
  pageId = '*',
  componentId = '*',
  posts,
  isLoading,
  onFeedReachBottom,
}: GlobalFeedProps) => {
  const { getConfig } = useCustomization();
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
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

  if (posts.length === 0 && !isLoading) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  return (
    <div className={styles.global_feed} style={themeStyles}>
      {posts.map((post, index) => (
        <div key={post.postId}>
          {index !== 0 ? <div className={styles.global_feed__divider} /> : null}
          <div className={styles.global_feed__postContainer}>
            <PostContent
              pageId={pageId}
              post={post}
              type="feed"
              onClick={() => {
                AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({ postId: post.postId });
              }}
            />
          </div>
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
      <div ref={intersectionRef} className={styles.global_feed__intersection} />
    </div>
  );
};
