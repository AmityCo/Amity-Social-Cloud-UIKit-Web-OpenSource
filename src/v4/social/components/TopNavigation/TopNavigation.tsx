import React from 'react';
import { notificationTray } from '@amityco/ts-sdk';
import { PostCreationButton } from '~/v4/social/elements/PostCreationButton';
import { GlobalSearchButton } from '~/v4/social/elements/GlobalSearchButton';
import { HeaderLabel } from '~/v4/social/elements/HeaderLabel';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { NotificationTrayButton } from '~/v4/social/elements/NotificationTrayButton/NotificationTrayButton';
import styles from './TopNavigation.module.css';
import useSDK from '~/v4/core/hooks/useSDK';

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
  const { goToSocialGlobalSearchPage, goToCreateCommunityPage, goToNotificationTrayPage } =
    useNavigation();
  const { isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isVisitorOrBot } = useSDK();

  const handleGlobalSearchClick = () => {
    switch (selectedTab) {
      case HomePageTab.Newsfeed:
      case HomePageTab.Events:
      case HomePageTab.Communities:
        goToSocialGlobalSearchPage();
    }
  };

  if (isExcluded) return null;

  const handleNotificationTrayButtonClick = () => {
    notificationTray.markTraySeen(new Date().toISOString());
    goToNotificationTrayPage();
  };

  return (
    <div className={styles.topNavigation} style={themeStyles}>
      <div className={styles.topNavigationLeftPane}>
        <HeaderLabel pageId={pageId} componentId={componentId} />
      </div>
      <div className={styles.topNavigationRightPane}>
        {!isVisitorOrBot && (
          <NotificationTrayButton
            pageId={pageId}
            componentId={componentId}
            onPress={handleNotificationTrayButtonClick}
          />
        )}
        <GlobalSearchButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleGlobalSearchClick}
        />
        {!isVisitorOrBot && (
          <PostCreationButton
            pageId={pageId}
            componentId={componentId}
            onClick={() =>
              selectedTab == HomePageTab.MyCommunities
                ? goToCreateCommunityPage?.({
                    mode: AmityCommunitySetupPageMode.CREATE,
                  })
                : onClickPostCreationButton?.()
            }
          />
        )}
      </div>
    </div>
  );
}
