import React, { ReactNode, useState } from 'react';
import Check from '~/v4/icons/Check';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Remove from '~/v4/icons/Remove';
import clsx from 'clsx';
import styles from './styles.module.css';

const DEFAULT_NOTIFICATION_DURATION = 3000;

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface NotificationData {
  id: number;
  content: ReactNode;
  icon?: ReactNode;
}

type NotificationInput = Omit<NotificationData, 'id'> & { duration?: number };

const Notification = ({ className, content, icon }: NotificationProps) => (
  <div data-theme="dark" className={clsx(styles.notificationContainer, className)}>
    {icon} {content}
  </div>
);

let spawnNewNotification: (notificationData: NotificationInput) => void; // for modifying NotificationContainer state outside

// rendered by provider, to allow spawning of notification from notification function below
export const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const removeNotification = (id: number) =>
    setNotifications &&
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );

  spawnNewNotification = ({
    duration = DEFAULT_NOTIFICATION_DURATION,
    ...notificationData
  }: NotificationInput) => {
    const id = Date.now();

    setNotifications([{ id, ...notificationData }, ...notifications]);

    setTimeout(() => removeNotification(id), duration);
  };

  return (
    <div className={styles.notifications}>
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};

/*
  Usage:
  notification.success({
    content: 'Report Sent',
  });

  This interface rely on NotificationsContainer being rendered by UIKITProvider in the react tree
*/
export const notification = {
  success: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <Check className={styles.icon} /> }),
  info: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <ExclamationCircle className={styles.icon} /> }),
  error: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <Remove className={styles.icon} /> }),
  show: (data: Omit<NotificationInput, 'icon'>) => spawnNewNotification(data),
};

export default Notification;
