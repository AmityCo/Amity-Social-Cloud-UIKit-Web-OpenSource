import React from 'react';

import { StoryTabCommunityFeed } from './StoryTabCommunity';
import { StoryTabGlobalFeed } from './StoryTabGlobalFeed';

type StoryTabType = 'communityFeed' | 'globalFeed';

type StoryTabProps<T extends StoryTabType> = {
  type: T;
  communityId?: T extends 'communityFeed' ? string : never;
};

export const StoryTab = <T extends StoryTabType>({ type, communityId }: StoryTabProps<T>) => {
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
