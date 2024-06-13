import React from 'react';
import { CommunityFeedStory } from './CommunityFeedStory';
import { GlobalFeedStory } from './GlobalFeedStory';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
}

const ViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type }) => {
  const { page } = useNavigation();

  if (page.type !== PageTypes.ViewStoryPage || !page.context.targetId) return null;

  if (type === 'communityFeed') return <CommunityFeedStory communityId={page.context.targetId} />;
  if (type === 'globalFeed') return <GlobalFeedStory targetId={page.context.targetId} />;

  return null;
};

export default ViewStoryPage;
