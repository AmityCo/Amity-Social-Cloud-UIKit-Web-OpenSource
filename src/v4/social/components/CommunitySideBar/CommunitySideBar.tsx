import React from 'react';
import clsx from 'clsx';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useConfig } from '~/v4/social/providers/ConfigProvider';
import { useNavigation, PageTypes } from '~/v4/core/providers/NavigationProvider';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages';
import { MyCommunitiesSideBar } from '~/v4/social/internal-components/MyCommunitiesSideBar';
import { MyCommunitiesSideBarTitle } from '~/v4/social/elements/MyCommunitiesSideBarTitle';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { Breadcrumb } from '~/v4/core/components';
import styles from './CommunitySideBar.module.css';
import { notificationTray } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
};

export const CommunitySideBar = ({ className, pageId = '*' }: CommunitySideBarProps) => {
  const { currentUserId } = useSDK();

  //#region button navigators
  const handleProfileClick = () => {
    if (currentUserId) {
      goToUserProfilePage(currentUserId);
    } else {
      console.log('Navigate to --> profile (user not logged in)');
    }
  };

  const handleHomeClick = () => {
    goToSocialHomePage();
  };

  const handleNotificationsClick = () => {
    goToNotificationTrayPage();
  };

  const handleChatClick = () => {
    console.log('Navigate to --> chat');
  };

  const handleSettingsClick = () => {
    console.log('Navigate to --> settings');
  };
  //#endregion

  const componentId = 'community_sidebar';
  const {
    goToCreateCommunityPage,
    page,
    goToUserProfilePage,
    goToSocialHomePage,
    goToNotificationTrayPage,
  } = useNavigation();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { accessibilityId, themeStyles, config, uiReference, defaultConfig } = useAmityComponent({
    componentId,
    pageId,
  });

  const isProfileActive =
    page.type === PageTypes.UserProfilePage || page.type === PageTypes.EditUserProfilePage;
  const isHomeActive = page.type === PageTypes.SocialHomePage;
  const isNotificationsActive = page.type === PageTypes.NotificationTrayPage;
  const isChatActive = false;
  const isSettingsActive = false;

  const handleNotificationTrayButtonClick = () => {
    notificationTray.markTraySeen(new Date().toISOString());
  };
  const handleCreateCommunityClick = () => {
    goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE });
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.communitySideBar, className)}
    >
      <div className={styles.communitySideBar__breadcrumbContainer}>
        <Breadcrumb pageId={pageId} componentId={componentId} maxItems={3} />
      </div>

      <div className={styles.communitySideBar__menuSection}>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="profile_sidebar_menu_item"
            icon="User" //TODO > replace with profile picture
            text="Profile"
            isActive={isProfileActive}
            onPress={handleProfileClick}
          />
        </div>

        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="home_sidebar_menu_item"
            text="Home"
            icon="HomeIcon"
            isActive={isHomeActive}
            onPress={handleHomeClick}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="notifications_sidebar_menu_item"
            text="Notifications"
            icon="Balloon"
            isActive={isNotificationsActive}
            onPress={handleNotificationsClick}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="chat_sidebar_menu_item"
            text="Chat"
            icon="Message"
            isActive={isChatActive}
            onPress={handleChatClick}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="settings_sidebar_menu_item"
            text="Settings"
            icon="BarsIcon"
            isActive={isSettingsActive}
            onPress={handleSettingsClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunitySideBar;
