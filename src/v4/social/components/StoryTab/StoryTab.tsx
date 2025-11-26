import React from 'react';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { Carousel } from '~/v4/core/components/Carousel';
import { StoryTabCommunityFeed } from '~/v4/social/components/StoryTab/StoryTabCommunity';
import { StoryTabGlobalFeed } from '~/v4/social/components/StoryTab/StoryTabGlobalFeed';
import { LiveRoomTarget } from '~/v4/social/features/livestream/elements/LiveRoomTarget';
import styles from './StoryTab.module.css';
import clsx from 'clsx';
import { CommunityLiveRoomTarget } from '~/v4/social/features/livestream/elements/CommunityLiveRoomTarget';
import { GlobalFeedStorySkeleton } from '~/v4/social/internal-components/Skeleton';

type StoryTabProps = ({ type: 'communityFeed'; communityId: string } | { type: 'globalFeed' }) & {
  pageId?: string;
};

export const StoryTab: React.FC<StoryTabProps> = ({ pageId = '*', ...props }) => {
  const componentId = 'story_tab_component';
  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();
  const { goToViewStoryPage, goToDraftStoryPage } = useNavigation();
  const { setFile } = useStoryContext();

  const [isLiveRoomLoading, setIsLiveRoomLoading] = React.useState(true);
  const [isStoriesLoading, setIsStoriesLoading] = React.useState(true);
  const [liveRooms, setLiveRooms] = React.useState<Amity.Post[]>([]);
  const [stories, setStories] = React.useState<Amity.StoryTarget[]>([]);

  const isLoading = isLiveRoomLoading || isStoriesLoading;

  const hasContent = liveRooms.length > 0 || stories.length > 0;

  const isHidden = isLoading || liveRooms.length + stories.length <= 6;

  const renderStoryTab = () => {
    switch (props.type) {
      case 'communityFeed':
        return (
          <div className={styles.storyTabContainer__communityStory}>
            <StoryTabCommunityFeed
              componentId={componentId}
              communityId={props.communityId || ''}
              onFileChange={(file) => {
                setFile(file);
                if (file) {
                  goToDraftStoryPage(
                    props.communityId || '',
                    'community',
                    file.type.includes('image')
                      ? { type: 'image', url: URL.createObjectURL(file) }
                      : { type: 'video', url: URL.createObjectURL(file) },
                    'communityFeed',
                  );
                }
              }}
              onStoryClick={() =>
                goToViewStoryPage({
                  targetId: props.communityId || '',
                  targetType: 'community',
                  storyType: 'communityFeed',
                })
              }
              onLoadingChange={setIsStoriesLoading}
            />
            <CommunityLiveRoomTarget
              onLoadingChange={setIsLiveRoomLoading}
              onLiveRoomsChange={setLiveRooms}
              communityId={props.communityId}
            />
          </div>
        );
      case 'globalFeed':
        if (!isLoading && !hasContent) {
          return null;
        }

        return (
          <Carousel
            scrollOffset={300}
            isHidden={isHidden}
            iconClassName={styles.storyTab__arrowIcon}
            leftArrowClassName={clsx(styles.storyTab__arrow, styles.left)}
            rightArrowClassName={clsx(styles.storyTab__arrow, styles.right)}
          >
            <div className={styles.storyTabContainer}>
              {isLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <GlobalFeedStorySkeleton key={index} />
                ))}
              <LiveRoomTarget
                onLoadingChange={setIsLiveRoomLoading}
                onLiveRoomsChange={setLiveRooms}
              />
              <StoryTabGlobalFeed
                pageId={pageId}
                componentId={componentId}
                goToViewStoryPage={({ storyTarget, storyTargets }) => {
                  AmityGlobalFeedComponentBehavior?.goToViewStoryPage?.({
                    targetId: storyTarget.targetId,
                    targetType: storyTarget.targetType as Amity.StoryTargetType,
                    storyType: 'globalFeed',
                    targetIds: storyTargets.map((s) => s.targetId),
                  });
                }}
                onLoadingChange={setIsStoriesLoading}
                onStoriesChange={setStories}
              />
            </div>
          </Carousel>
        );
    }
  };

  return renderStoryTab();
};
