import clsx from 'clsx';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunitySideBarTitle } from '~/v4/social/elements/CommunitySideBarTitle';
import { NotificationTrayPage, SocialGlobalSearchPage } from '~/v4/social/pages';
import {
  NewsFeedMenuItem,
  CommunitiesMenuItem,
  EventsMenuItem,
} from '~/v4/social/elements/CommunitySideBarMenuItem';
import { NotificationTrayButton } from '~/v4/social/elements';
import styles from './CommunitySideBar.module.css';
import { notificationTray } from '@amityco/ts-sdk';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useSearchResultContext } from '~/v4/social/providers/SearchResultProvider';
import useSDK from '~/v4/core/hooks/useSDK';

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
  /**
   * When true the sidebar looks identical to normal (search box, menu items and
   * notification tray all still render) but is non-interactive — clicks do
   * nothing. Used on standalone pre-login screens (e.g. CreateUserProfilePage)
   * where the sidebar is shown for visual continuity but should not navigate
   * anywhere. Interaction is blocked at the container via `pointer-events: none`.
   */
  disabled?: boolean;
};

export const CommunitySideBar = ({
  className,
  pageId = '*',
  disabled = false,
}: CommunitySideBarProps) => {
  const componentId = 'community_sidebar';
  const { isVisitorOrBot } = useSDK();
  const { searchValue } = useSearchResultContext();
  const { accessibilityId, themeStyles } = useAmityComponent({ componentId, pageId });

  const handleNotificationTrayButtonClick = () => {
    notificationTray.markTraySeen(new Date().toISOString());
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      // When disabled, block all interaction at the container so the sidebar
      // still renders identically to the normal one but nothing is clickable.
      data-disabled={disabled}
      aria-disabled={disabled}
      className={clsx(styles.communitySideBar, className)}
    >
      <div className={styles.communitySideBar__header}>
        <div className={styles.communitySideBar__headerLeft}>
          <CommunitySideBarTitle pageId={pageId} componentId={componentId} />
          {!isVisitorOrBot && (
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
          )}
        </div>

        <SocialGlobalSearchPage keyword={searchValue} />
      </div>

      <div className={styles.communitySideBar__menuSection}>
        {!isVisitorOrBot && <NewsFeedMenuItem pageId={pageId} componentId={componentId} />}
        <CommunitiesMenuItem pageId={pageId} componentId={componentId} />
        <EventsMenuItem pageId={pageId} componentId={componentId} />
      </div>
    </div>
  );
};

export default CommunitySideBar;
