import React from 'react';
import { CommunityFeedStory } from './CommunityFeedStory';
import { useNavigation } from '~/social/providers/NavigationProvider';

type AmityViewStoryPageType = 'communityFeed';

interface AmityViewStoryPageProps {
  type: AmityViewStoryPageType;
}

export const AmityViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type }) => {
  const { page } = useNavigation();

  const renderContent = () => {
    switch (type) {
      case 'communityFeed':
        return <CommunityFeedStory communityId={page.targetId} />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};
