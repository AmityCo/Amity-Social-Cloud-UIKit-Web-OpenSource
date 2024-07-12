import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

import { StoryTabCommunityFeed } from '~/v4/social/components/StoryTab/StoryTabCommunity';
import { StoryTabGlobalFeed } from '~/v4/social/components/StoryTab/StoryTabGlobalFeed';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';

type StoryTabProps = { type: 'communityFeed'; communityId: string } | { type: 'globalFeed' };

export const StoryTab: React.FC<StoryTabProps> = (props) => {
  const componentId = 'story_tab_component';
  const { onClickStory, goToDraftStoryPage } = useNavigation();
  const { setFile } = useStoryContext();

  const renderStoryTab = () => {
    switch (props.type) {
      case 'communityFeed':
        return (
          <StoryTabCommunityFeed
            componentId={componentId}
            communityId={props.communityId}
            onFileChange={(file) => {
              setFile(file);
              if (file) {
                goToDraftStoryPage(
                  props.communityId,
                  'community',
                  file.type.includes('image')
                    ? { type: 'image', url: URL.createObjectURL(file) }
                    : { type: 'video', url: URL.createObjectURL(file) },
                  'communityFeed',
                );
              }
            }}
            onStoryClick={() => onClickStory(props.communityId, 'communityFeed')}
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
    }
  };

  return renderStoryTab();
};
