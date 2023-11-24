import { useCallback, useState } from 'react';
import { notification } from '~/core/components/Notification';

export function useAsyncCallback(callback, deps) {
  const [loading, setLoading] = useState(false);

  const newCallback = useCallback(async (...args) => {
    try {
      setLoading(true);
      await callback(...args);
    } catch (error) {
      notification.error({ content: error.message });
    } finally {
      setLoading(false);
    }
  }, deps);

  return [newCallback, loading];
}
