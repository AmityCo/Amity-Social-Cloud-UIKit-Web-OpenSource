import React from 'react';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';

import { StoryTabCommunityFeed } from './StoryTabCommunity';
import { StoryTabGlobalFeed } from './StoryTabGlobalFeed';

type StoryTabType = 'communityFeed' | 'globalFeed';

type StoryTabProps<T extends StoryTabType> = {
  pageId?: string;
  type: T;
  communityId?: T extends 'communityFeed' ? string : never;
};

export const StoryTab = <T extends StoryTabType>({
  pageId = '*',
  type,
  communityId,
}: StoryTabProps<T>) => {
  const componentId = 'story_tab_component';
  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();
  const { goToViewStoryPage, goToDraftStoryPage } = useNavigation();
  const { setFile } = useStoryContext();

  const renderStoryTab = () => {
    switch (type) {
      case 'communityFeed':
        return (
          <StoryTabCommunityFeed
            pageId={pageId}
            componentId={componentId}
            communityId={communityId || ''}
            onFileChange={(file) => {
              setFile(file);
              if (file) {
                goToDraftStoryPage({
                  targetId: communityId || '',
                  targetType: 'community',
                  mediaType: file.type.includes('image')
                    ? { type: 'image', url: URL.createObjectURL(file) }
                    : { type: 'video', url: URL.createObjectURL(file) },
                });
              }
            }}
            onStoryClick={() =>
              goToViewStoryPage({
                targetId: communityId || '',
                targetType: 'community',
                storyType: 'communityFeed',
              })
            }
          />
        );
      case 'globalFeed':
        return (
          <StoryTabGlobalFeed
            pageId={pageId}
            componentId={componentId}
            goToViewStoryPage={({ storyTarget, storyTargets }) => {
              AmityGlobalFeedComponentBehavior.goToViewStoryPage({
                targetId: storyTarget.targetId,
                targetType: storyTarget.targetType,
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
