import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { StoryTabCommunityFeed } from '~/v4/social/components/StoryTab/StoryTabCommunity';
import { StoryTabGlobalFeed } from '~/v4/social/components/StoryTab/StoryTabGlobalFeed';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';

type StoryTabType = 'communityFeed' | 'globalFeed';

type StoryTabProps<T extends StoryTabType> = {
  type: T;
  communityId?: T extends 'communityFeed' ? string : never;
};

export const StoryTab = <T extends StoryTabType>({ type, communityId }: StoryTabProps<T>) => {
  const componentId = 'story_tab_component';
  const { onClickStory, goToDraftStoryPage } = useNavigation();

  const { setFile } = useStoryContext();

  const renderStoryTab = () => {
    switch (type) {
      case 'communityFeed':
        return (
          <StoryTabCommunityFeed
            componentId={componentId}
            communityId={communityId || ''}
            onFileChange={(file) => {
              setFile(file);
              if (file) {
                goToDraftStoryPage(
                  communityId || '',
                  'community',
                  file.type.includes('image')
                    ? { type: 'image', url: URL.createObjectURL(file) }
                    : { type: 'video', url: URL.createObjectURL(file) },
                  'communityFeed',
                );
              }
            }}
            onStoryClick={() => onClickStory(communityId || '', 'communityFeed')}
          />
        );
      case 'globalFeed':
        return (
          <StoryTabGlobalFeed
            componentId={componentId}
            goToViewStoryPage={({ storyTarget, storyTargets }) => {
              onClickStory(
                storyTarget.targetId,
                'globalFeed',
                storyTargets.map((s) => s.targetId),
              );
            }}
          />
        );
      default:
        return null;
    }
  };

  return renderStoryTab();
};
