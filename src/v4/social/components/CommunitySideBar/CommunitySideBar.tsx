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
import {
  ExploreMenuItem,
  NewsFeedMenuItem,
  CreateCommunityMenuItem,
} from '~/v4/social/elements/CommunitySideBarMenuItem';
import { NotificationTrayButton } from '~/v4/social/elements';
import styles from './CommunitySideBar.module.css';
import { notificationTray } from '@amityco/ts-sdk';
import { Popover } from '~/v4/core/components/AriaPopover';

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
  const componentId = 'community_sidebar';
  const { goToCreateCommunityPage } = useNavigation();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { accessibilityId, themeStyles } = useAmityComponent({ componentId, pageId });

  const handleNotificationTrayButtonClick = () => {
    notificationTray.markTraySeen(new Date().toISOString());
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
        <NewsFeedMenuItem pageId={pageId} componentId={componentId} />
        {!isExploreHidden && <ExploreMenuItem pageId={pageId} componentId={componentId} />}
      </div>
      <div className={styles.communitySideBar__myCommunitiesSection}>
        <MyCommunitiesSideBarTitle pageId={pageId} componentId={componentId} />
        {socialCommunityCreationButtonVisible && (
          <CreateCommunityMenuItem
            pageId={pageId}
            componentId={componentId}
            onPress={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
          />
        )}
        <MyCommunitiesSideBar pageId={pageId} />
      </div>
    </div>
  );
};

export default CommunitySideBar;
