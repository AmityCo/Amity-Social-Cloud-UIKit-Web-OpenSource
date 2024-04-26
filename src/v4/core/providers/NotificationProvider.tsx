import React, { createContext, ReactNode, useContext, useState } from 'react';

import CheckCircle from '~/v4/icons/CheckCircle';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Remove from '~/v4/icons/Remove';
import styles from './NotificationProvider.module.css';

interface Notification {
  id: number;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
}

type NotificationInput = Omit<Notification, 'id'> & { duration?: number };

interface NotificationContextProps {
  notifications: Notification[];
  notificationFunction: {
    success: (data: Omit<NotificationInput, 'icon'>) => void;
    info: (data: Omit<NotificationInput, 'icon'>) => void;
    error: (data: Omit<NotificationInput, 'icon'>) => void;
    show: (data: Omit<NotificationInput, 'icon'>) => void;
  };
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  notificationFunction: {
    success: () => {},
    info: () => {},
    error: () => {},
    show: () => {},
  },
});

const DEFAULT_NOTIFICATION_DURATION = 3000;

export const NotificationProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: number) =>
    setNotifications &&
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );

  const addNotifications = (data: NotificationInput) => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        id,
        ...data,
      },
    ]);

    setTimeout(() => {
      removeNotification(id);
    }, data?.duration || DEFAULT_NOTIFICATION_DURATION);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationFunction: {
          success: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({ ...data, icon: <CheckCircle className={styles.icon} /> }),
          info: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({ ...data, icon: <ExclamationCircle className={styles.icon} /> }),
          error: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({ ...data, icon: <Remove className={styles.icon} /> }),
          show: (data: Omit<NotificationInput, 'icon'>) => addNotifications(data),
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationData = () => {
  const { notifications } = useContext(NotificationContext);
  return notifications;
};

export const useNotifications = () => {
  const { notificationFunction } = useContext(NotificationContext);
  return notificationFunction;
};
