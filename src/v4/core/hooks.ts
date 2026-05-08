import { resolveString } from '~/v4/core/localization';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';

export const useCopyMessage = () => {
  const notification = useLiveChatNotifications();

  const copyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
    notification.success({
      content: resolveString('amity_livechat_notification_copy_message'),
    });
  };

  return copyMessage;
};
