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
  const pageId = 'view_story_page';
  const { onBack, goToDraftStoryPage, onClickCommunity, onChangePage, onClickStory } =
    useNavigation();

  const goToNewsFeed = () => {
    onChangePage(PageTypes.NewsFeed);
  };

  const goToCommunity = (communityId: string) => {
    onClickCommunity(communityId);
  };

  if (type === 'communityFeed')
    return (
      <CommunityFeedStory
        pageId={pageId}
        communityId={targetId}
        onBack={onBack}
        onClose={goToCommunity}
        onSwipeDown={goToCommunity}
        onClickCommunity={goToCommunity}
        goToDraftStoryPage={({ targetId, targetType, mediaType, storyType }) =>
          goToDraftStoryPage(targetId, targetType, mediaType, storyType)
        }
      />
    );

  if (type === 'globalFeed')
    return (
      <ViewGlobalFeedStoryPage
        pageId={pageId}
        targetId={targetId}
        onChangePage={goToNewsFeed}
        onClose={goToNewsFeed}
        onSwipeDown={goToNewsFeed}
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
