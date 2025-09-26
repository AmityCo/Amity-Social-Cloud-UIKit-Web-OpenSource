import { notificationTray } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const POLLING_INTERVAL = 60 * 1000; // 1 minute

const useGetNotificationTraySeen = () => {
  const [notificationTraySeen, setNotificationTraySeen] = useState<
    Amity.NotificationTraySeen | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchNotificationTraySeen = () => {
      // Clear previous subscription if exists
      if (unsubscribe) {
        unsubscribe();
      }

      unsubscribe = notificationTray.getNotificationTraySeen((data) => {
        setNotificationTraySeen(data.data);
        setIsLoading(data.loading);
      });
    };

    // Initial fetch
    fetchNotificationTraySeen();

    // Set up polling every minute
    const intervalId = setInterval(() => {
      fetchNotificationTraySeen();
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { notificationTraySeen, isLoading };
};

export default useGetNotificationTraySeen;
