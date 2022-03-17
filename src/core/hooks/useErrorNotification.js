import { useEffect, useState } from 'react';

import { notification } from '~/core/components/Notification';

const useErrorNotification = () => {
  const [error, setError] = useState(null);
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
