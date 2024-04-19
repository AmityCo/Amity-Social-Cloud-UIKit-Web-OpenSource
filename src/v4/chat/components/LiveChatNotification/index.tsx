import React, { ReactNode, useState } from 'react';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import CheckCircle from '~/icons/CheckCircle';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Typography } from '~/v4/core/components/index';

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

const LiveChatNotification = ({ className, content, icon }: NotificationProps) => (
  <div data-theme="dark" className={clsx(styles.notificationContainer, className)}>
    {icon}
    <Typography.Body>{content}</Typography.Body>
  </div>
);

let spawnNewNotification: (notificationData: NotificationInput) => void; // for modifying NotificationContainer state outside

export const LiveChatNotificationsContainer = () => {
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
        return <LiveChatNotification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};

/*
  Usage:
  notification.success({
    content: 'Report Sent',
  });

  This interface rely on LiveChatNotificationsContainer being rendered by live chat page only
*/
export const notification = {
  success: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <CheckCircle className={styles.icon} /> }),
  error: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <ExclamationCircle className={styles.icon} /> }),
  show: (data: Omit<NotificationInput, 'icon'>) => spawnNewNotification(data),
};

export default LiveChatNotification;
