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
import { ChevronLeft, DotsIcon } from '~/icons';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

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
  const { isDesktop } = useResponsive();
  const {
    goToSocialGlobalSearchPage,
    goToMyCommunitiesSearchPage,
    goToCreateCommunityPage,
    goToNotificationTrayPage,
  } = useNavigation();
  const { isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const handleGlobalSearchClick = () => {
    switch (selectedTab) {
      case HomePageTab.Newsfeed:
      case HomePageTab.Explore:
        goToSocialGlobalSearchPage();
        break;
      case HomePageTab.MyCommunities:
        goToMyCommunitiesSearchPage();
        break;
    }
  };

  if (isExcluded) return null;

  const handleNotificationTrayButtonClick = () => {
    notificationTray.markTraySeen(new Date().toISOString());
    goToNotificationTrayPage();
  };
  const { goToSettingsPage = () => {} } = useNavigation();
  const handleSettingsClick = () => {
    goToSettingsPage();
  };
  return (
    <div className={styles.topNavigation} style={themeStyles}>
      {!isDesktop && <ChevronLeft width={16} height={16} fill="#000" stroke="#000" />}
      <HeaderLabel pageId={pageId} componentId={componentId} />
      {!isDesktop && (
        <span onClick={handleSettingsClick}>
          <DotsIcon width={16} height={16} fill="#000" stroke="#000" />
        </span>
      )}
    </div>
  );
}
