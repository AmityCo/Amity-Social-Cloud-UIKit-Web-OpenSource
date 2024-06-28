import React from 'react';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';

import { StoryTabCommunityFeed } from './StoryTabCommunity';
import { StoryTabGlobalFeed } from './StoryTabGlobalFeed';

type StoryTabProps = { type: 'communityFeed'; communityId: string } | { type: 'globalFeed' };

export const StoryTab: React.FC<StoryTabProps> = (props) => {
  const componentId = 'story_tab_component';
  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();
  const { goToViewStoryPage, goToDraftStoryPage } = useNavigation();
  const { setFile } = useStoryContext();

  const renderStoryTab = () => {
    switch (props.type) {
      case 'communityFeed':
        return (
          <StoryTabCommunityFeed
            componentId={componentId}
            communityId={props.communityId || ''}
            onFileChange={(file) => {
              setFile(file);
              if (file) {
                goToDraftStoryPage({
                  targetId: props.communityId || '',
                  targetType: 'community',
                  mediaType: file.type.includes('image')
                    ? { type: 'image', url: URL.createObjectURL(file) }
                    : { type: 'video', url: URL.createObjectURL(file) },
                  storyType: 'communityFeed',
                });
              }
            }}
            onStoryClick={() =>
              goToViewStoryPage({
                targetId: props.communityId || '',
                targetType: 'community',
                storyType: 'communityFeed',
              })
            }
          />
        );
      case 'globalFeed':
        return (
          <StoryTabGlobalFeed
            componentId={componentId}
            goToViewStoryPage={({ storyTarget, storyTargets }) => {
              AmityGlobalFeedComponentBehavior.goToViewStoryPage({
                targetId: storyTarget.targetId,
                targetType: storyTarget.targetType as Amity.StoryTargetType,
                storyType: 'globalFeed',
                targetIds: storyTargets.map((s) => s.targetId),
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return renderStoryTab();
};
