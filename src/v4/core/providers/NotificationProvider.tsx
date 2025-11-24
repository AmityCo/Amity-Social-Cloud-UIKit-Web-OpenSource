import React, { createContext, ReactNode, useContext, useState } from 'react';

import CheckCircle from '~/v4/icons/CheckCircle';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Remove from '~/v4/icons/Remove';
import styles from './NotificationProvider.module.css';
import { Spinner } from '~/v4/social/internal-components/Spinner';

interface Notification {
  id?: number | string;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
}

type NotificationInput = Notification & {
  duration?: number;
  alignment?: 'fullscreen' | 'withSidebar' | 'fixed';
};

interface NotificationContextProps {
  notifications: Notification[];
  notificationFunction: {
    remove: (id: Notification['id']) => void;
    success: (data: Omit<NotificationInput, 'icon'>) => void;
    info: (data: Omit<NotificationInput, 'icon'>) => void;
    error: (data: Omit<NotificationInput, 'icon'>) => void;
    show: (data: Omit<NotificationInput, 'icon'>) => void;
    loading: (data: Omit<NotificationInput, 'icon'>) => void;
  };
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  notificationFunction: {
    remove: () => {},
    success: () => {},
    info: () => {},
    error: () => {},
    show: () => {},
    loading: () => {},
  },
});

const DEFAULT_NOTIFICATION_DURATION = 3000;

export const NotificationProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: Notification['id']) =>
    setNotifications &&
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );

  const addNotifications = (data: NotificationInput) => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        ...data,
        id: data.id || id,
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
          remove: removeNotification,
          success: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({
              ...data,
              icon: <CheckCircle className={styles.icon} />,
              alignment: data.alignment,
            }),
          info: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({
              ...data,
              icon: <ExclamationCircle className={styles.icon} />,
              alignment: data.alignment,
            }),
          error: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({
              ...data,
              icon: <Remove className={styles.icon} />,
              alignment: data.alignment,
            }),
          loading: (data: Omit<NotificationInput, 'icon'>) =>
            addNotifications({
              ...data,
              icon: <Spinner className={styles.icon} />,
              alignment: data.alignment,
            }),
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
