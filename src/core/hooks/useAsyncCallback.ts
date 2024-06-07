import { useCallback, useState } from 'react';
import { useNotifications } from '../providers/NotificationProvider';

/**
 * @deprecated
 *
 **/
export function useAsyncCallback<T extends Array<unknown>, U, V extends (...args: T) => U>(
  callback: V,
  deps: unknown[],
): [(...args: T) => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
  const notification = useNotifications();

  const newCallback = useCallback(async (...args: T) => {
    try {
      setLoading(true);
      await callback(...args);
    } catch (error) {
      if (error instanceof Error) notification.error({ content: error.message });
    } finally {
      setLoading(false);
    }
  }, deps);

  return [newCallback, loading];
}
