import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import CheckCircle from '~/v4/icons/CheckCircle';
import Remove from '~/v4/icons/Remove';
import styles from './NotificationProvider.module.css';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import Info from '~/v4/icons/Info';

interface Notification {
  id?: number | string;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
}

type NotificationInput = Notification & {
  duration?: number;
  alignment?: NotificationAlignment;
};

type NotificationFunction = {
  remove: (id: Notification['id']) => void;
  success: (data: Omit<NotificationInput, 'icon'>) => void;
  info: (data: Omit<NotificationInput, 'icon'>) => void;
  error: (data: Omit<NotificationInput, 'icon'>) => void;
  show: (data: Omit<NotificationInput, 'icon'>) => void;
  loading: (data: Omit<NotificationInput, 'icon'>) => void;
};

interface NotificationContextProps {
  notifications: Notification[];
  notificationFunction: NotificationFunction;
}

// Keep the combined context exported for backward compatibility
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

const defaultNotificationFunction: NotificationFunction = {
  remove: () => {},
  success: () => {},
  info: () => {},
  error: () => {},
  show: () => {},
  loading: () => {},
};

// Separate context for notification data (only consumed by NotificationsContainer)
const NotificationDataContext = createContext<Notification[]>([]);

// Separate context for notification functions (consumed by all other components).
// This context value is stable and does not change when notifications are added/removed,
// preventing unnecessary re-renders of consumers like GlobalFeedStory.
const NotificationFunctionContext = createContext<NotificationFunction>(
  defaultNotificationFunction,
);

const DEFAULT_NOTIFICATION_DURATION = 3000;

export const NotificationProvider: React.FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback(
    (id: Notification['id']) =>
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id),
      ),
    [],
  );

  const addNotifications = useCallback((data: NotificationInput) => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        ...data,
        id: data.id || id,
      },
    ]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, data?.duration || DEFAULT_NOTIFICATION_DURATION);
  }, []);

  const notificationFunction = useMemo<NotificationFunction>(
    () => ({
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
          icon: <Info className={styles.icon} />,
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
    }),
    [removeNotification, addNotifications],
  );

  return (
    <NotificationDataContext.Provider value={notifications}>
      <NotificationFunctionContext.Provider value={notificationFunction}>
        {children}
      </NotificationFunctionContext.Provider>
    </NotificationDataContext.Provider>
  );
};

export const useNotificationData = () => {
  return useContext(NotificationDataContext);
};

export const useNotifications = () => {
  return useContext(NotificationFunctionContext);
};
