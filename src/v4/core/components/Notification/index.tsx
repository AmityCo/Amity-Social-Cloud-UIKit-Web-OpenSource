import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useNotificationData } from '~/v4/core/providers/NotificationProvider';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
}

const Notification = ({ className, content, icon }: NotificationProps) => (
  <div data-theme="dark" className={clsx(styles.notificationContainer, className)}>
    {icon} {content}
  </div>
);

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
