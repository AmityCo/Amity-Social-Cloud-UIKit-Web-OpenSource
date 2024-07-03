import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import styles from './Notification.module.css';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
}

export const Notification = ({ className, content, icon, duration }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (duration) {
    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  }

  if (!isVisible) return null;

  return (
    isVisible && (
      <div className={clsx(styles.notificationContainer, className)}>
        <div className={clsx(styles.icon__container)}>{icon}</div> {content}
      </div>
    )
  );
};

// rendered by provider, to allow spawning of notification from notification function below
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
