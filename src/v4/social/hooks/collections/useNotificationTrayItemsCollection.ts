import { notificationTray } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useNotificationTrayItemsCollection({ limit = 20 }) {
  const { items, ...rest } = useLiveCollection({
    fetcher: notificationTray.getNotificationTrayItems,
    params: {
      limit,
    },
  });

  return {
    items,
    ...rest,
  };
}
