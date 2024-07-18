import React from 'react';
import { CommunityFeedStory } from '~/v4/social/pages/StoryPage/CommunityFeedStory';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ViewGlobalFeedStoryPage } from '~/v4/social/pages/StoryPage/ViewGlobalFeedStory';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
  targetId: string;
}

const ViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type, targetId }) => {
  const pageId = 'story_page';
  const { AmityStoryViewPageBehavior } = usePageBehavior();
  const { onBack, goToViewStoryPage, goToDraftStoryPage, onClickCommunity } = useNavigation();

  if (type === 'communityFeed')
    return (
      <CommunityFeedStory
        pageId={pageId}
        communityId={targetId}
        onBack={onBack}
        onClose={(communityId) => onClickCommunity(communityId)}
        onSwipeDown={(communityId) => onClickCommunity(communityId)}
        onClickCommunity={(communityId) => onClickCommunity(communityId)}
        goToDraftStoryPage={(targetId, targetType, mediaType, storyType) =>
          goToDraftStoryPage(targetId, targetType, mediaType, storyType)
        }
      />
    );
  if (type === 'globalFeed')
    return (
      <ViewGlobalFeedStoryPage
        pageId={pageId}
        targetId={targetId}
        onChangePage={() => AmityStoryViewPageBehavior?.onCloseAction?.()}
        onClose={() => AmityStoryViewPageBehavior?.onCloseAction?.()}
        onSwipeDown={() => AmityStoryViewPageBehavior?.onCloseAction?.()}
        onClickStory={(targetId) =>
          goToViewStoryPage({
            storyType: 'globalFeed',
            targetId,
            targetType: 'community',
          })
        }
        goToDraftStoryPage={(targetId, targetType, mediaType, storyType) =>
          goToDraftStoryPage(targetId, targetType, mediaType, storyType)
        }
        onClickCommunity={(targetId) => onClickCommunity(targetId)}
      />
    );

  return null;
};

export default ViewStoryPage;
