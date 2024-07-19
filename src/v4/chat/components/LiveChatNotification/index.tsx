import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { Typography } from '~/v4/core/components/index';
import { useLiveChatNotificationData } from '~/v4/chat/providers/LiveChatNotificationProvider';

interface NotificationProps {
  className?: string;
  content: ReactNode;
  icon?: ReactNode;
}

const LiveChatNotification = ({ className, content, icon }: NotificationProps) => (
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

export default LiveChatNotification;
