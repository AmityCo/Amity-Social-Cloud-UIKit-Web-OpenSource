import React from 'react';

import { StoryTabCommunityFeed } from './StoryTabCommunity';
import { StoryTabGlobalFeed } from './StoryTabGlobalFeed';

type AmityStoryTabComponentType = 'communityFeed' | 'globalFeed';

type AmityStoryTabComponentProps<T extends AmityStoryTabComponentType> = {
  type: T;
  communityId?: T extends 'communityFeed' ? string : never;
};

export const StoryTab = <T extends AmityStoryTabComponentType>({
  type,
  communityId,
}: AmityStoryTabComponentProps<T>) => {
  const renderStoryTab = () => {
    switch (type) {
      case 'communityFeed':
        return <StoryTabCommunityFeed communityId={communityId || ''} />;
      case 'globalFeed':
        return <StoryTabGlobalFeed />;
      default:
        return null;
    }
  };

  return renderStoryTab();
};
