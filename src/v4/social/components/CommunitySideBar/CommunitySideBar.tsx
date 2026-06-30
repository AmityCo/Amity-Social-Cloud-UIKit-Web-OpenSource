import clsx from 'clsx';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommunitySideBarTitle } from '~/v4/social/elements/CommunitySideBarTitle';
import { NotificationTrayPage, SocialGlobalSearchPage } from '~/v4/social/pages';
import {
  ForYouMenuItem,
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
import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import useForYouFeedSetting from '~/v4/social/hooks/useForYouFeedSetting';

type CommunitySideBarProps = {
  pageId?: string;
  className?: string;
  isExploreHidden?: boolean;
};

export function CommunitySideBar({ className, pageId = '*' }: CommunitySideBarProps) {
  const componentId = 'community_sidebar';
  const { isVisitorOrBot } = useSDK();
  const { searchValue } = useSearchResultContext();
  const { accessibilityId, themeStyles } = useAmityComponent({ componentId, pageId });

  const { isLoading: isForYouFeedSettingLoading } = useForYouFeedSetting({
    shouldCall: !isVisitorOrBot,
  });

  const isResolvingForYou = !isVisitorOrBot && isForYouFeedSettingLoading;

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
        {isResolvingForYou ? (
          <CommunitySideBar.MenuSkeleton />
        ) : (
          <>
            <ForYouMenuItem pageId={pageId} componentId={componentId} />
            {!isVisitorOrBot && <NewsFeedMenuItem pageId={pageId} componentId={componentId} />}
            <CommunitiesMenuItem pageId={pageId} componentId={componentId} />
            <EventsMenuItem pageId={pageId} componentId={componentId} />
          </>
        )}
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <Skeleton
      className={styles.communitySideBar__menuSkeleton}
      data-testid="community_sidebar_menu_skeleton"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`menu-item-${index}`} className={styles.communitySideBar__menuSkeletonItem}>
          <Skeleton.Circle width="2rem" height="2rem" />
          <Skeleton.Line width="11.25rem" height="0.5rem" />
        </Skeleton>
      ))}
    </Skeleton>
  );
}

CommunitySideBar.MenuSkeleton = MenuSkeleton;

export default CommunitySideBar;
