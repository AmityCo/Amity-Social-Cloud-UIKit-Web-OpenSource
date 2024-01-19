import React, { ReactNode, useState } from 'react';

import { NotificationContainer, Notifications, SuccessIcon, InfoIcon, ErrorIcon } from './styles';

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
  <NotificationContainer className={className}>
    {icon} {content}
  </NotificationContainer>
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
    <Notifications>
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </Notifications>
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
    spawnNewNotification({ ...data, icon: <SuccessIcon /> }),
  info: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <InfoIcon /> }),
  error: (data: Omit<NotificationInput, 'icon'>) =>
    spawnNewNotification({ ...data, icon: <ErrorIcon /> }),
  show: (data: Omit<NotificationInput, 'icon'>) => spawnNewNotification(data),
};

export default Notification;
