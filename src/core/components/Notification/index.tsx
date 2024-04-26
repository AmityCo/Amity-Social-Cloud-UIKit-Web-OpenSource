import React, { ReactNode, useEffect, useState } from 'react';
import { useNotificationData } from '~/core/providers/NotificationProvider';

import { NotificationContainer, Notifications } from './styles';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
}

const Notification = ({ className, content, icon }: NotificationProps) => (
  <NotificationContainer className={className}>
    {icon} {content}
  </NotificationContainer>
);

// rendered by provider, to allow spawning of notification from notification function below
export const NotificationsContainer = () => {
  const notifications = useNotificationData();

  return (
    <Notifications>
      {notifications.map((notificationData) => {
        return <Notification {...notificationData} key={notificationData.id} />;
      })}
    </Notifications>
  );
};

export default Notification;
