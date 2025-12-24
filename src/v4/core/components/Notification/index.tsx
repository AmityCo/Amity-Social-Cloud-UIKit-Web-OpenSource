import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';
import styles from './Notification.module.css';

export type NotificationAlignment =
  | 'fullscreen'
  | 'withSidebar'
  | 'fixed'
  | 'live-chat'
  | 'livestreamWithChat';

interface NotificationProps {
  alignment?: NotificationAlignment;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  isShowAttributes?: string | boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  onClose?: () => void;
}

export const Notification = ({
  alignment = 'withSidebar',
  content,
  icon,
  duration,
  isShowAttributes,
  className,
  iconClassName,
  textClassName,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (duration) {
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
  }

  if (!isVisible) return null;

  return (
    isVisible && (
      <div
        data-testid="toast-notification"
        data-show-detail-media-attachment={isShowAttributes}
        className={clsx(styles.notificationContainer, className)}
        data-alignment={alignment}
      >
        <div className={clsx(styles.icon__container, iconClassName)}>{icon}</div>{' '}
        {typeof content === 'string' ? (
          <Typography.Body
            data-testid="toast-notification-text"
            className={clsx(styles.notification__text, textClassName)}
          >
            {content}
          </Typography.Body>
        ) : (
          content
        )}
      </div>
    )
  );
};

export const NotificationsContainer = () => {
  const notifications = useNotificationData();

  return (
    <div className={styles.notifications} data-testid="toast-notifications-container">
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};

export default Notification;
