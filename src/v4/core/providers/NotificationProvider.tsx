import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import CheckCircle from '~/v4/icons/CheckCircle';
import FailedOutlined from '~/v4/icons/FailedOutlined';
import styles from './NotificationProvider.module.css';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import Info from '~/v4/icons/Info';
import type { ToastVariant } from '~/v4/core/design/atoms/Toast';

export type NotificationModule = 'chat';

interface Notification {
  id?: number | string;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  variant?: ToastVariant;
  module?: NotificationModule;
  alignment?: NotificationAlignment;
}

type NotificationFunction = {
  remove: (id: Notification['id']) => void;
  success: (data: Omit<Notification, 'icon'>) => void;
  info: (data: Omit<Notification, 'icon'>) => void;
  error: (data: Omit<Notification, 'icon'>) => void;
  show: (data: Omit<Notification, 'icon'>) => void;
  loading: (data: Omit<Notification, 'icon'>) => void;
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

  const addNotifications = useCallback((data: Notification) => {
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
      success: (data: Omit<Notification, 'icon'>) =>
        addNotifications({
          ...data,
          variant: 'success',
          icon: <CheckCircle className={styles.icon} />,
          alignment: data.alignment,
        }),
      info: (data: Omit<Notification, 'icon'>) =>
        addNotifications({
          ...data,
          variant: 'informative',
          icon: <Info className={styles.icon} />,
          alignment: data.alignment,
        }),
      error: (data: Omit<Notification, 'icon'>) =>
        addNotifications({
          ...data,
          variant: 'error',
          icon: <FailedOutlined className={styles.icon} />,
          alignment: data.alignment,
        }),
      loading: (data: Omit<Notification, 'icon'>) =>
        addNotifications({
          ...data,
          variant: 'loading',
          icon: <Spinner className={styles.icon} />,
          alignment: data.alignment,
        }),
      show: (data: Omit<Notification, 'icon'>) => addNotifications(data),
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

export const useNotifications = (module?: NotificationModule) => {
  const notificationFunction = useContext(NotificationFunctionContext);

  return useMemo(() => {
    if (!module) return notificationFunction;

    const withModule =
      (fn: (data: Omit<Notification, 'icon'>) => void) => (data: Omit<Notification, 'icon'>) =>
        fn({ ...data, module });

    return {
      remove: notificationFunction.remove,
      success: withModule(notificationFunction.success),
      info: withModule(notificationFunction.info),
      error: withModule(notificationFunction.error),
      loading: withModule(notificationFunction.loading),
      show: withModule(notificationFunction.show),
    };
  }, [notificationFunction, module]);
};
