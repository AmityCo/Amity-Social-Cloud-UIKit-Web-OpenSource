import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';
import styles from './Notification.module.css';

interface NotificationProps {
  alignment?: 'fullscreen' | 'withSidebar' | 'fixed';
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  isShowAttributes?: string | boolean;
  className?: string;
  onClose?: () => void;
}

export const Notification = ({
  alignment = 'withSidebar',
  content,
  icon,
  duration,
  isShowAttributes,
  className,
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
        data-show-detail-media-attachment={isShowAttributes}
        className={clsx(styles.notificationContainer, className)}
        data-alignment={alignment}
      >
        <div className={clsx(styles.icon__container)}>{icon}</div>{' '}
        {typeof content === 'string' ? (
          <Typography.Body className={styles.notification__text}>{content}</Typography.Body>
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
    <div className={styles.notifications}>
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};

export default Notification;
