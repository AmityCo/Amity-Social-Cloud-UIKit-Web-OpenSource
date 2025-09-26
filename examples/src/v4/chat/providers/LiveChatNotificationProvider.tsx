import React, { createContext, ReactNode, useContext, useState } from 'react';
import CheckCircle from '~/v4/icons/CheckCircle';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';

import styles from './LiveChatNotificationProvider.module.css';

interface LiveChatNotification {
  id: number;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
}

type LiveChatNotificationInput = Omit<LiveChatNotification, 'id'> & { duration?: number };

interface LiveChatNotificationContextProps {
  liveChatNotifications: LiveChatNotification[];
  liveChatNotificationFunction: {
    success: (data: Omit<LiveChatNotificationInput, 'icon'>) => void;
    error: (data: Omit<LiveChatNotificationInput, 'icon'>) => void;
    show: (data: Omit<LiveChatNotificationInput, 'icon'>) => void;
  };
}

export const LiveChatNotificationContext = createContext<LiveChatNotificationContextProps>({
  liveChatNotifications: [],
  liveChatNotificationFunction: {
    success: () => {},
    error: () => {},
    show: () => {},
  },
});

const DEFAULT_NOTIFICATION_DURATION = 3000;

export const LiveChatNotificationProvider: React.FC = ({ children }) => {
  const [liveChatNotifications, setLiveChatNotifications] = useState<LiveChatNotification[]>([]);

  const removeLiveChatNotification = (id: number) =>
    setLiveChatNotifications &&
    setLiveChatNotifications((prevLiveChatNotifications) =>
      prevLiveChatNotifications.filter((notification) => notification.id !== id),
    );

  const addLiveChatNotifications = (data: LiveChatNotificationInput) => {
    const id = Date.now();
    setLiveChatNotifications((prevLiveChatNotifications) => [
      ...prevLiveChatNotifications,
      {
        id,
        ...data,
      },
    ]);

    setTimeout(() => {
      removeLiveChatNotification(id);
    }, data?.duration || DEFAULT_NOTIFICATION_DURATION);
  };

  return (
    <LiveChatNotificationContext.Provider
      value={{
        liveChatNotifications,
        liveChatNotificationFunction: {
          success: (data: Omit<LiveChatNotificationInput, 'icon'>) =>
            addLiveChatNotifications({ ...data, icon: <CheckCircle className={styles.icon} /> }),
          error: (data: Omit<LiveChatNotificationInput, 'icon'>) =>
            addLiveChatNotifications({
              ...data,
              icon: <ExclamationCircle className={styles.icon} />,
            }),
          show: (data: Omit<LiveChatNotificationInput, 'icon'>) => addLiveChatNotifications(data),
        },
      }}
    >
      {children}
    </LiveChatNotificationContext.Provider>
  );
};

export const useLiveChatNotificationData = () => {
  const { liveChatNotifications } = useContext(LiveChatNotificationContext);
  return liveChatNotifications;
};

export const useLiveChatNotifications = () => {
  const { liveChatNotificationFunction } = useContext(LiveChatNotificationContext);
  return liveChatNotificationFunction;
};
