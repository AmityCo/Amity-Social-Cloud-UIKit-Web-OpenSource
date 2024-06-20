import React from 'react';
import { CommunityFeedStory } from '~/v4/social/pages/StoryPage/CommunityFeedStory';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { ViewGlobalFeedStoryPage } from '~/v4/social/pages/StoryPage/ViewGlobalFeedStory';
import { PageTypes } from '~/social/constants';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
  targetId: string;
}

const ViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type, targetId }) => {
  const { onBack, goToDraftStoryPage, onClickCommunity, onChangePage, onClickStory } =
    useNavigation();

  if (type === 'communityFeed')
    return (
      <CommunityFeedStory
        communityId={targetId}
        onBack={onBack}
        onClose={(communityId) => onClickCommunity(communityId)}
        onSwipeDown={(communityId) => onClickCommunity(communityId)}
        onClickCommunity={(communityId) => onClickCommunity(communityId)}
      />
    );
  if (type === 'globalFeed')
    return (
      <ViewGlobalFeedStoryPage
        targetId={targetId}
        onChangePage={() => onChangePage(PageTypes.NewsFeed)}
        onClose={() => {
          onChangePage(PageTypes.NewsFeed);
        }}
        onSwipeDown={() => onChangePage(PageTypes.NewsFeed)}
        onClickStory={(targetId) => onClickStory(targetId, 'globalFeed')}
        goToDraftStoryPage={({ targetId, targetType, mediaType, storyType }) =>
          goToDraftStoryPage(targetId, targetType, mediaType, storyType)
        }
        onClickCommunity={(targetId) => onClickCommunity(targetId)}
      />
    );

  return null;
};

export default ViewStoryPage;
