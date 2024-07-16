import React from 'react';
import { PostCreationButton } from '~/v4/social/elements/PostCreationButton';
import { GlobalSearchButton } from '~/v4/social/elements/GlobalSearchButton';
import { HeaderLabel } from '~/v4/social/elements/HeaderLabel';
import styles from './TopNavigation.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { HomePageTab } from '~/v4/social/pages/SocialHomePage/SocialHomePage';

export interface TopNavigationProps {
  pageId?: string;
  selectedTab?: HomePageTab;
  onClickPostCreationButton?: () => void;
}

export function TopNavigation({
  pageId = '*',
  selectedTab,
  onClickPostCreationButton,
}: TopNavigationProps) {
  const componentId = 'top_navigation';
  const { goToSocialGlobalSearchPage, goToMyCommunitiesSearchPage } = useNavigation();
  const { isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const handleGlobalSearchClick = () => {
    switch (selectedTab) {
      case HomePageTab.Newsfeed:
        goToSocialGlobalSearchPage();
        break;
      case HomePageTab.Explore:
        break;
      case HomePageTab.MyCommunities:
        goToMyCommunitiesSearchPage();
        break;
    }
  };

  if (isExcluded) return null;

  return (
    <div className={styles.topNavigation} style={themeStyles}>
      <div className={styles.topNavigationLeftPane}>
        <HeaderLabel pageId={pageId} componentId={componentId} />
      </div>
      <div className={styles.topNavigationRightPane}>
        <GlobalSearchButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleGlobalSearchClick}
        />
        {selectedTab !== HomePageTab.Explore && (
          <PostCreationButton
            pageId={pageId}
            componentId={componentId}
            onClick={onClickPostCreationButton}
          />
        )}
      </div>
    </div>
  );
}
