import React, { useState, useEffect } from 'react';

import { NotificationContainer, Notifications, SuccessIcon, InfoIcon, ErrorIcon } from './styles';

const DEFAULT_NOTIFICATION_DURATION = 3000;

const Notification = ({ className, content, icon }) => (
  <NotificationContainer clean className={className}>
    {icon} {content}
  </NotificationContainer>
);

let spawnNewNotification; // for modfying NotificationContainer state outside

// rendered by provider, to allow spawning of notification from notification function below
export const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = id =>
    setNotifications &&
    setNotifications(notifications => notifications.filter(notification => notification.id != id));

  spawnNewNotification = (
    { duration = DEFAULT_NOTIFICATION_DURATION, ...notificationData },
    icon,
  ) => {
    const id = Date.now();

    setNotifications([{ id, ...notificationData }, ...notifications]);

    setTimeout(() => removeNotification(id), duration);
  };

  return <Notifications>{notifications.map(Notification)}</Notifications>;
};

/*
  Usage:
  notification.success({
    content: 'Report Sent',
  });

  This interface rely on NotificationsContainer being rendered by UIKITProvider in the react tree
*/
export const notification = {
  success: data => spawnNewNotification({ ...data, icon: <SuccessIcon /> }),
  info: data => spawnNewNotification({ ...data, icon: <InfoIcon /> }),
  error: data => spawnNewNotification({ ...data, icon: <ErrorIcon /> }),
  show: data => spawnNewNotification(data),
};

export default Notification;
