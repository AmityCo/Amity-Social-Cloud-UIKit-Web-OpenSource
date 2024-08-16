import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { useLiveChatNotificationData } from '~/v4/chat/providers/LiveChatNotificationProvider';

import styles from './LiveChatNotification.module.css';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
}

export const LiveChatNotification = ({ className, content, icon }: NotificationProps) => (
  <div className={clsx(styles.notificationContainer, className)}>
    {icon}
    <Typography.Body>{content}</Typography.Body>
  </div>
);

export const LiveChatNotificationsContainer = () => {
  const notifications = useLiveChatNotificationData();

  return (
    <div className={styles.notifications}>
      {notifications.map((notificationData) => {
        return <LiveChatNotification {...notificationData} key={notificationData.id} />;
      })}
    </div>
  );
};
