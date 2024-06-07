import React from 'react';
import { CommunityFeedStory } from './CommunityFeedStory';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { PageTypes } from '~/social/constants';
import { GlobalFeedStory } from './GlobalFeedStory';

type AmityViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: AmityViewStoryPageType;
}

const AmityViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type }) => {
  const { page } = useNavigation();

  if (page.type !== PageTypes.ViewStory || !page.targetId) return null;

  if (type === 'communityFeed') return <CommunityFeedStory communityId={page.targetId} />;
  if (type === 'globalFeed') return <GlobalFeedStory targetId={page.targetId} />;

  return null;
};

export default AmityViewStoryPage;
