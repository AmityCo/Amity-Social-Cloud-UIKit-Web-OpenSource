import React, { useEffect, useState, useRef } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton, EmptyNotification, NoInternetConnection, Title } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useNotificationTrayItemsCollection from '~/v4/social/hooks/collections/useNotificationTrayItemsCollection';
import {
  NotificationTraySkeleton,
  NotificationItemSkeleton,
} from '~/v4/social/internal-components/NotificationTraySkeleton';
import { useNetworkState } from 'react-use';
import { NotificationItem } from '~/v4/social/internal-components/NotificationItem';
import { Typography } from '~/v4/core/components';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import Notification from '~/v4/core/components/Notification';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './NotificationTrayPage.module.css';

interface NotificationTrayPageProps {
  onClose?: () => void;
}

export const NotificationTrayPage = ({ onClose }: NotificationTrayPageProps) => {
  const pageId = 'notification_tray_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  const recentItems = items.filter((item) => item.isRecent);
  const unRecentItems = items.filter((item) => !item.isRecent);

  useEffect(() => {
    refresh();
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

        <Title pageId={pageId} titleClassName={styles.notificationTrayPage__title} />
        <div className={styles.notificationTrayPage__topBarGap} />
      </div>
      <div className={styles.notificationTrayPage__content}>
        {online && !error ? (
          <>
            {isLoading && items.length === 0 && <NotificationTraySkeleton />}

            {items.length > 0 && (
              <div className={styles.notificationTrayPage__itemsWrapper}>
                {recentItems.length > 0 && (
                  <>
                    <Typography.CaptionBold as="p" className={styles.notificationTrayPage__header}>
                      Recent
                    </Typography.CaptionBold>
                    {recentItems.map((item) => (
                      <NotificationItem
                        pageId={pageId}
                        key={item._id}
                        item={item}
                        onClose={onClose}
                      />
                    ))}
                  </>
                )}

                {unRecentItems.length > 0 && (
                  <>
                    <Typography.CaptionBold as="p" className={styles.notificationTrayPage__header}>
                      Older
                    </Typography.CaptionBold>
                    {unRecentItems.map((item) => (
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

            {!isLoading && items.length === 0 && <EmptyNotification pageId={pageId} />}

            {isLoading &&
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
