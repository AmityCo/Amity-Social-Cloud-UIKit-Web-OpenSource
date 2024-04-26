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

  const renderContent = () => {
    switch (type) {
      case 'communityFeed':
        if (page.type === PageTypes.ViewStory && page.targetId) {
          return <CommunityFeedStory communityId={page.targetId} />;
        }
        return null;
      case 'globalFeed':
        if (page.type === PageTypes.ViewStory && page.targetId) {
          return <GlobalFeedStory targetId={page.targetId} />;
        }
        return null;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default AmityViewStoryPage;
