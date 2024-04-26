import { useIntl } from 'react-intl';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';

export const useCopyMessage = () => {
  const notification = useLiveChatNotifications();
  const { formatMessage } = useIntl();

  const copyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
    notification.success({
      content: formatMessage({ id: 'livechat.notification.copy.message' }),
    });
  };

  return copyMessage;
};
