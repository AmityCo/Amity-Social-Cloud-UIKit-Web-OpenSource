import clsx from 'clsx';
import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useConfig } from '~/v4/social/providers/ConfigProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarTitle } from '~/v4/social/elements/CommunitySideBarTitle';
import {
  AmityCommunitySetupPageMode,
  NotificationTrayPage,
  SocialGlobalSearchPage,
} from '~/v4/social/pages';
import { MyCommunitiesSideBar } from '~/v4/social/internal-components/MyCommunitiesSideBar';
import { MyCommunitiesSideBarTitle } from '~/v4/social/elements/MyCommunitiesSideBarTitle';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { NotificationTrayButton } from '~/v4/social/elements';
import styles from './CommunitySideBar.module.css';
import { notificationTray } from '@amityco/ts-sdk';
import { Popover } from '~/v4/core/components/AriaPopover';

// Placeholder icon -- to replace with Icon component
const PlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <text x="12" y="15" textAnchor="middle" fontSize="10" fill="currentColor">
      ICON
    </text>
  </svg>
);

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
};

export const CommunitySideBar = ({
  className,
  pageId = '*',
  isExploreHidden,
}: CommunitySideBarProps) => {
  //#region button navigators (gonna be repacade by Link components)
  const handleProfileClick = () => {
    console.log('Link to -->  profile');
  };

  const handleHomeClick = () => {
    console.log('Link to -->  home');
  };

  const handleNotificationsClick = () => {
    console.log('Link to -->  notifications');
  };

  const handleChatClick = () => {
    console.log('Link to -->  chat');
  };

  const handleSettingsClick = () => {
    console.log('Link to -->  settings');
  };
  //#endregion

  const componentId = 'community_sidebar';
  const { goToCreateCommunityPage } = useNavigation();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { accessibilityId, themeStyles } = useAmityComponent({ componentId, pageId });

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
      <div className={styles.communitySideBar__header}>
        <div className={styles.communitySideBar__headerLeft}>
          <CommunitySideBarTitle pageId={pageId} componentId={componentId} />
          <Popover
            placement="bottom left"
            className={styles.communitySideBar__notificationTray}
            trigger={({ openPopover }) => {
              return (
                <NotificationTrayButton
                  pageId={pageId}
                  componentId={componentId}
                  onPress={() => {
                    openPopover();
                    handleNotificationTrayButtonClick();
                  }}
                />
              );
            }}
            aria-label="notification_tray"
          >
            {({ closePopover }) => <NotificationTrayPage onClose={closePopover} />}
          </Popover>
        </div>

        <SocialGlobalSearchPage />
      </div>

      <div className={styles.communitySideBar__menuSection}>
        <CustomSideBarMenuItem
          pageId={pageId}
          componentId={componentId}
          elementId="profile_sidebar_menu_item"
          text="Profile"
          icon={PlaceholderIcon}
          onPress={handleProfileClick}
        />

        <CustomSideBarMenuItem
          pageId={pageId}
          componentId={componentId}
          elementId="home_sidebar_menu_item"
          text="Home"
          icon={PlaceholderIcon}
          onPress={handleHomeClick}
        />
        <CustomSideBarMenuItem
          pageId={pageId}
          componentId={componentId}
          elementId="notifications_sidebar_menu_item"
          text="Notifications"
          icon={PlaceholderIcon}
          onPress={handleNotificationsClick}
        />
        <CustomSideBarMenuItem
          pageId={pageId}
          componentId={componentId}
          elementId="chat_sidebar_menu_item"
          text="Chat"
          icon={PlaceholderIcon}
          onPress={handleChatClick}
        />
        <CustomSideBarMenuItem
          pageId={pageId}
          componentId={componentId}
          elementId="settings_sidebar_menu_item"
          text="Settings"
          icon={PlaceholderIcon} // TODO: Replace with your Settings icon component
          onPress={handleSettingsClick}
        />
      </div>
      <div className={styles.communitySideBar__myCommunitiesSection}>
        <MyCommunitiesSideBarTitle pageId={pageId} componentId={componentId} />
        {socialCommunityCreationButtonVisible && (
          <CustomSideBarMenuItem
            pageId={pageId}
            componentId={componentId}
            elementId="create_community_sidebar_menu_item"
            text="Create Community"
            icon={PlaceholderIcon}
            onPress={handleCreateCommunityClick}
          />
        )}
        <MyCommunitiesSideBar pageId={pageId} />
      </div>
    </div>
  );
};

export default CommunitySideBar;
