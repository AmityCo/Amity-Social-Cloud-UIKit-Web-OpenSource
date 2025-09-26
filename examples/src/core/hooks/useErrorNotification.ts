import { useEffect, useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

const useErrorNotification = () => {
  const [error, setError] = useState<string | null>(null);
  const notification = useNotifications();

  useEffect(() => {
    if (error) {
      notification.error({
        content: error,
      });
      setError(null);
    }
  }, [error]);

  return [setError];
};

export default useErrorNotification;
