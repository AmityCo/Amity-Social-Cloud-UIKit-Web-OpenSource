import React from 'react';
import { CommunityFeedStory } from '~/v4/social/pages/StoryPage/CommunityFeedStory';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ViewGlobalFeedStoryPage } from './ViewGlobalFeedStory';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
  targetId: string;
}

const ViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type, targetId }) => {
  const { AmityStoryViewPageBehavior } = usePageBehavior();
  const { onBack, goToViewStoryPage, goToDraftStoryPage, onClickCommunity } = useNavigation();

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
        onChangePage={() => AmityStoryViewPageBehavior.onCloseAction()}
        onClose={() => AmityStoryViewPageBehavior.onCloseAction()}
        onSwipeDown={() => AmityStoryViewPageBehavior.onCloseAction()}
        onClickStory={(targetId) =>
          goToViewStoryPage({
            storyType: 'globalFeed',
            targetId,
            targetType: 'community',
          })
        }
        goToDraftStoryPage={({ targetId, targetType, mediaType, storyType }) =>
          goToDraftStoryPage({ targetId, targetType, mediaType, storyType })
        }
        onClickCommunity={(targetId) => onClickCommunity(targetId)}
      />
    );

  return null;
};

export default ViewStoryPage;
