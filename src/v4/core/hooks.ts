import { useIntl } from 'react-intl';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useCopyMessage = () => {
  const notification = useNotifications();
  const { formatMessage } = useIntl();

  const copyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
    notification.show({
      content: formatMessage({ id: 'livechat.notification.copy.message' }),
    });
  };

  return copyMessage;
};
