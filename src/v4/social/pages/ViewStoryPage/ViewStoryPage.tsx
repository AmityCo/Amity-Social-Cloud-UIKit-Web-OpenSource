import React from 'react';
import { CommunityFeedStory } from '~/v4/social/pages/ViewStoryPage/CommunityFeedStory';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ViewGlobalFeedStoryPage } from '~/v4/social/pages/ViewStoryPage/ViewGlobalFeedStory';
import { ThemeContext, useTheme } from '~/v4/core/providers/ThemeProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import styles from './ViewStoryPage.module.css';

type ViewStoryPageType = 'communityFeed' | 'globalFeed';

interface AmityViewStoryPageProps {
  type: ViewStoryPageType;
  targetId: string;
}

export function ViewStoryPage({ type, targetId }: AmityViewStoryPageProps) {
  const pageId = 'story_page';
  const { accessibilityId, themeStyles, isExcluded } = useAmityPage({ pageId });
  const { AmityStoryViewPageBehavior } = usePageBehavior();
  const { onBack, goToViewStoryPage, goToDraftStoryPage, onClickCommunity } = useNavigation();
  const { toggleTheme, setDefaultTheme } = useTheme();

  const forcedLightTheme = {
    currentTheme: 'light' as const,
    forcedTheme: 'light' as const,
    toggleTheme,
    setDefaultTheme,
  };

  if (isExcluded) return null;

  if (type === 'communityFeed')
    return (
      <ThemeContext.Provider value={forcedLightTheme}>
        <div className={styles.viewStoryPage} data-testid={accessibilityId} style={themeStyles}>
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
        </div>
      </ThemeContext.Provider>
    );
  if (type === 'globalFeed')
    return (
      <ThemeContext.Provider value={forcedLightTheme}>
        <div className={styles.viewStoryPage} data-testid={accessibilityId} style={themeStyles}>
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
                // Replace instead of push so the viewer keeps a single story page on the stack;
                // pressing close then exits the viewer instead of stepping back story-by-story.
                replace: true,
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
        </div>
      </ThemeContext.Provider>
    );

  return null;
}
