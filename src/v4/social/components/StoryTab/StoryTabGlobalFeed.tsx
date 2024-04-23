import React, { useRef } from 'react';
import styles from './StoryTabGlobalFeed.module.css';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useGetGlobalStoryTargets } from '../../hooks/collections/useGetGlobalStoryTargets';
import { StoryTabItem } from './StoryTabItem';
import InfiniteScroll from 'react-infinite-scroll-component';

interface StoryTabGlobalFeedProps {}

export const StoryTabGlobalFeed: React.FC<StoryTabGlobalFeedProps> = () => {
  const { stories, isLoading, hasMore, loadMoreStories } = useGetGlobalStoryTargets({
    seenState: 'smart' as Amity.StorySeenQuery,
    limit: 10,
  });
  const { onClickStory } = useNavigation();
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className={styles.storyTabContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.storyTabSkeleton}>
            <div className={styles.storyTabSkeletonAvatar} />
            <div className={styles.storyTabSkeletonUsername} />
          </div>
        ))}
      </div>
    );
  }

  if (stories?.length === 0) return null;

  return (
    <div className={styles.storyTabContainer} ref={containerRef}>
      <InfiniteScroll
        dataLength={stories.length}
        next={loadMoreStories}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        style={{ display: 'flex', overflowX: 'auto' }}
        scrollThreshold={0.9}
        scrollableTarget="containerRef"
      >
        {stories.map((story) => {
          return (
            <StoryTabItem
              key={story.targetId}
              targetId={story.targetId}
              hasUnseen={story.hasUnseen}
              onClick={() => onClickStory(story.targetId)}
              size={64}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};
