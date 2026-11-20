import React, { useEffect, useState } from 'react';
import styles from './StoryTabGlobalFeed.module.css';
import { StoryTabItem } from './StoryTabItem';
import { useGlobalStoryTargets } from '~/v4/social/hooks/collections/useGlobalStoryTargets';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

const STORIES_PER_PAGE = 10;

interface StoryTabGlobalFeedProps {
  pageId?: string;
  componentId?: string;
  goToViewStoryPage: (data: {
    storyTarget: Amity.StoryTarget;
    storyTargets: Amity.StoryTarget[];
  }) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onStoriesChange?: (stories: Amity.StoryTarget[]) => void;
}

export const StoryTabGlobalFeed = ({
  pageId = '*',
  componentId = '*',
  goToViewStoryPage,
  onLoadingChange,
  onStoriesChange,
}: StoryTabGlobalFeedProps) => {
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { stories, isLoading, loadMoreStories, refresh } = useGlobalStoryTargets({
    seenState: 'smart' as Amity.StorySeenQuery,
    limit: STORIES_PER_PAGE,
  });

  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({ node: sentinel, onIntersect: loadMoreStories });

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading]);

  useEffect(() => {
    onStoriesChange?.(stories);
  }, [stories]);

  if (isExcluded) return null;

  if (!isLoading && stories?.length === 0) return null;

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.storyTabContainer}>
      {stories.map((story) => {
        return (
          <StoryTabItem
            pageId={pageId}
            componentId={componentId}
            key={story.targetId}
            targetId={story.targetId}
            hasUnseen={story.hasUnseen}
            isErrored={story.failedStoriesCount > 0}
            onClick={() =>
              goToViewStoryPage({
                storyTargets: stories,
                storyTarget: story,
              })
            }
            size={64}
          />
        );
      })}

      <div ref={setSentinel} style={{ height: '1px', width: '1px' }} />
    </div>
  );
};
