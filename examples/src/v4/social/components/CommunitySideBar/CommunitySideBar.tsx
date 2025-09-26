import React from 'react';
import clsx from 'clsx';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation, PageTypes } from '~/v4/core/providers/NavigationProvider';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { CustomProfileMenuItem } from '~/v4/social/elements/CustomProfileMenuItem';
import styles from './CommunitySideBar.module.css';
import useSDK from '~/v4/core/hooks/useSDK';

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
};

export const CommunitySideBar = ({ className, pageId = '*' }: CommunitySideBarProps) => {
  //#region button navigators
  const handleHomeClick = () => {
    goToSocialHomePage();
  };

  const handleNotificationsClick = () => {
    goToNotificationTrayPage();
  };

  const handleChatClick = () => {
    goToChatPage();
  };

  const handleSettingsClick = () => {
    goToSettingPage();
  };

  //#endregion

  const componentId = 'community_sidebar';
  const { page, goToSocialHomePage, goToNotificationTrayPage, goToSettingPage, goToChatPage } =
    useNavigation();
  const { accessibilityId, themeStyles, config, uiReference, defaultConfig } = useAmityComponent({
    componentId,
    pageId,
  });
  const { currentUserId } = useSDK();
  const isHomeActive = page.type === PageTypes.SocialHomePage;
  const isNotificationsActive = page.type === PageTypes.NotificationTrayPage;
  const isChatActive = page.type === PageTypes.ChatPage;
  const isSettingsActive = page.type === PageTypes.SettingPage;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.communitySideBar, className)}
    >
      <div className={styles.communitySideBar__menuSection}>
        <div className={styles.communitySideBar__menuButton}>
          <CustomProfileMenuItem
            pageId={pageId}
            componentId={componentId}
            userName="My Profile"
            userTitle="View & Edit Profile"
            userId={currentUserId}
            userBadgeTitle="Lupo Solitario"
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
            className={styles.sidebarPadding}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="notifications_sidebar_menu_item"
            text="Notifications"
            icon="NotificationBell"
            isActive={isNotificationsActive}
            onPress={handleNotificationsClick}
            className={styles.sidebarPadding}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="chat_sidebar_menu_item"
            text="Community Chat"
            icon="ChatBubbleIcon"
            isActive={isChatActive}
            onPress={handleChatClick}
            className={styles.sidebarPadding}
          />
        </div>
        <div className={styles.communitySideBar__menuButton}>
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="settings_sidebar_menu_item"
            text="Settings"
            icon="GearIcon"
            isActive={isSettingsActive}
            onPress={handleSettingsClick}
            className={styles.sidebarPadding}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunitySideBar;
