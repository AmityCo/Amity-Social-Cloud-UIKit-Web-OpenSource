import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import Notification from '~/v4/core/components/Notification';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { InvitationSection } from '~/v4/social/components';
import { BackButton, EmptyNotification, NoInternetConnection, Title } from '~/v4/social/elements';
import useNotificationTrayItemsCollection from '~/v4/social/hooks/collections/useNotificationTrayItemsCollection';
import { NotificationItem } from '~/v4/social/internal-components/NotificationItem';
import {
  NotificationItemSkeleton,
  NotificationTraySkeleton,
} from '~/v4/social/internal-components/NotificationTraySkeleton';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useNetworkState } from 'react-use';
import styles from './NotificationTrayPage.module.css';

interface NotificationTrayPageProps {
  onClose?: () => void;
}

export const NotificationTrayPage = ({ onClose }: NotificationTrayPageProps) => {
  const pageId = 'notification_tray_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { invitationNotificationTray } = useLayoutContext();

  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({
    pageId,
  });

  if (isExcluded) return null;

  const { onBack } = useNavigation();
  const { isLoading, items, refresh, loadMore, hasMore, error } =
    useNotificationTrayItemsCollection({
      limit: 20,
    });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();
  const [notificationItemLoading, setNotificationItemLoading] = useState(false);

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        setNotificationItemLoading(true);
        loadMore();
      }
    },
    node: intersectionNode,
  });

  useEffect(() => {
    !isLoading && setNotificationItemLoading(isLoading);
  }, [isLoading]);

  const getItemsByDateRange = (startDays: number, endDays: number = 0, limit: number = 3) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - startDays);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(now.getDate() - endDays);
    endDate.setHours(23, 59, 59, 999);

    return items
      .filter((item) => {
        const itemDate = new Date(item.lastOccurredAt);
        return itemDate >= startDate && itemDate < endDate; // Cambiato <= in <
      })
      .slice(0, limit);
  };
  useEffect(() => {
    refresh();
    invitationNotificationTray.refresh();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollTop > 0);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.notificationTrayPage}
      ref={containerRef}
    >
      <div data-scrolled={isScrolled} className={styles.notificationTrayPage__topBar}>
        {!isDesktop && (
          <BackButton
            pageId={pageId}
            onPress={() => onBack()}
            imgClassName={styles.notificationTrayPage__closeButton}
          />
        )}
        <Typography.Headline>Notifications</Typography.Headline>
        <div className={styles.notificationTrayPage__topBarGap} />
      </div>
      <div className={styles.notificationTrayPage__content}>
        {online && !error ? (
          <>
            {isLoading || invitationNotificationTray.isLoading ? (
              <NotificationTraySkeleton />
            ) : (
              <div className={styles.notificationTrayPage__itemsWrapper}>
                {invitationNotificationTray.invitations.length > 0 && (
                  <InvitationSection
                    pageId={pageId}
                    onClose={onClose}
                    invitations={invitationNotificationTray.invitations}
                  />
                )}
                {getItemsByDateRange(0, 0, 3).length > 0 && (
                  <>
                    <Typography.SubTitleBold
                      as="h3"
                      style={{ textAlign: 'left' }}
                      className={styles.notificationTrayPage__header}
                    >
                      Today
                    </Typography.SubTitleBold>
                    {getItemsByDateRange(0, 0, 3).map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}
                {getItemsByDateRange(1, 1, 3).length > 0 && (
                  <>
                    <Typography.SubTitleBold
                      as="h3"
                      style={{ textAlign: 'left' }}
                      className={styles.notificationTrayPage__header}
                    >
                      Today
                    </Typography.SubTitleBold>
                    {getItemsByDateRange(1, 1, 3).map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}
                {getItemsByDateRange(2, 1, 3).length > 0 && (
                  <>
                    <Typography.SubTitleBold
                      as="h3"
                      style={{ textAlign: 'left' }}
                      className={styles.notificationTrayPage__header}
                    >
                      Ieri
                    </Typography.SubTitleBold>
                    {getItemsByDateRange(2, 1, 3).map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}
                {getItemsByDateRange(7, 2, 3).length > 0 && (
                  <>
                    <Typography.SubTitleBold
                      as="h3"
                      style={{ textAlign: 'left' }}
                      className={styles.notificationTrayPage__header}
                    >
                      Ultimi 7 giorni
                    </Typography.SubTitleBold>
                    {getItemsByDateRange(7, 2, 3).map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}
                {getItemsByDateRange(30, 7, 3).length > 0 && (
                  <>
                    <Typography.SubTitleBold
                      as="h3"
                      style={{ textAlign: 'left' }}
                      className={styles.notificationTrayPage__header}
                    >
                      Ultimi 30 giorni
                    </Typography.SubTitleBold>
                    {getItemsByDateRange(30, 7, 3).map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
            {!isLoading &&
              !invitationNotificationTray.isLoading &&
              invitationNotificationTray.invitations.length === 0 &&
              items.length === 0 && <EmptyNotification pageId={pageId} />}
            {notificationItemLoading &&
              items.length > 0 &&
              Array.from({ length: 3 }, (_, index) => (
                <NotificationItemSkeleton key={index} index={index} />
              ))}
            {error && !isLoading && (
              <div className={styles.notificationTrayPage__errorWrapper}>
                <NotificationTraySkeleton />
                <Notification
                  duration={3000}
                  alignment="fixed"
                  icon={
                    <ExclamationCircle className={styles.notificationTrayPage__notificationIcon} />
                  }
                  content="Oops, something went wrong."
                />
              </div>
            )}
            <div
              ref={(node) => setIntersectionNode(node)}
              className={styles.notificationTrayPage__observerTarget}
            />
          </>
        ) : (
          <NoInternetConnection pageId={pageId} />
        )}
      </div>
    </div>
  );
};
