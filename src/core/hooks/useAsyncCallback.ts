import { useCallback, useState } from 'react';
import { notification } from '~/core/components/Notification';

/**
 * @deprecated
 *
 **/
export function useAsyncCallback<T extends Array<unknown>, U, V extends (...args: T) => U>(
  callback: V,
  deps: unknown[],
): [(...args: T) => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);

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
