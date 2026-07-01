import React from 'react';
import { CommunityFeedStory } from '~/v4/social/pages/StoryPage/CommunityFeedStory';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ViewGlobalFeedStoryPage } from '~/v4/social/pages/StoryPage/ViewGlobalFeedStory';
import { ThemeContext, useTheme } from '~/v4/core/providers/ThemeProvider';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
  targetId: string;
}

const ViewStoryPage: React.FC<AmityViewStoryPageProps> = ({ type, targetId }) => {
  const pageId = 'story_page';
  const { AmityStoryViewPageBehavior } = usePageBehavior();
  const { onBack, goToViewStoryPage, goToDraftStoryPage, onClickCommunity } = useNavigation();
  const { toggleTheme, setDefaultTheme } = useTheme();

  const forcedLightTheme = { currentTheme: 'light' as const, toggleTheme, setDefaultTheme };

  if (type === 'communityFeed')
    return (
      <ThemeContext.Provider value={forcedLightTheme}>
        <CommunityFeedStory
          pageId={pageId}
          communityId={targetId}
          onBack={onBack}
          onClose={() => onBack()}
          onSwipeDown={(communityId) => onClickCommunity(communityId)}
          onClickCommunity={(communityId) => onClickCommunity(communityId)}
          goToDraftStoryPage={(targetId, targetType, mediaType, storyType) =>
            goToDraftStoryPage(targetId, targetType, mediaType, storyType)
          }
        />
      </ThemeContext.Provider>
    );
  if (type === 'globalFeed')
    return (
      <ThemeContext.Provider value={forcedLightTheme}>
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
          onClickCommunity={(targetId) => {
            onBack();
            onClickCommunity(targetId);
          }}
        />
      </ThemeContext.Provider>
    );

  return null;
};

export default ViewStoryPage;
