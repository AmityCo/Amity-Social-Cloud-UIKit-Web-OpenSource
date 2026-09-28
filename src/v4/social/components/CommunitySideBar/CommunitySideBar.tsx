import clsx from 'clsx';
import { useAmityComponent, useAmityElement } from '~/v4/core/hooks/uikit';
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

  const { isPending: isForYouFeedSettingPending } = useForYouFeedSetting({
    shouldCall: !isVisitorOrBot,
  });

  // The rail is chrome, not a feature. It used to belong to Community and
  // return null wholesale, which took Discovery's search with it — on desktop
  // only, because the rail is search's one desktop host and the top navigation
  // collapses to nothing there. Every child answers to its own module instead.
  //
  // R3 still applies to the rail itself: a container goes with its last visible
  // child, so it asks whether anything inside survived rather than drawing an
  // empty 288px column.
  const search = useAmityComponent({
    pageId: 'social_global_search_page',
    componentId: 'top_search_bar',
  });
  const tray = useAmityElement({ pageId, componentId, elementId: 'notification_tray_button' });
  const forYouItem = useAmityElement({
    pageId,
    componentId,
    elementId: 'for_you_sidebar_menu_item',
  });
  const newsfeedItem = useAmityElement({
    pageId,
    componentId,
    elementId: 'newsfeed_sidebar_menu_item',
  });
  const communitiesItem = useAmityElement({
    pageId,
    componentId,
    elementId: 'communities_sidebar_menu_item',
  });
  const eventsItem = useAmityElement({
    pageId,
    componentId,
    elementId: 'events_sidebar_menu_item',
  });

  const anythingSurvives = [
    search,
    tray,
    forYouItem,
    newsfeedItem,
    communitiesItem,
    eventsItem,
  ].some((child) => !child.isExcluded);
  if (!anythingSurvives) return null;

  const isResolvingForYou = !isVisitorOrBot && isForYouFeedSettingPending;

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
                    redDotTestId="notification-red-dot-sidebar"
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
