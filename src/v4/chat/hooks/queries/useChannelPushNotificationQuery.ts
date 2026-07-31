import { Client } from '@amityco/ts-sdk';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

export const CHANNEL_PUSH_NOTIFICATION_QUERY_KEY = 'channelPushNotification';

export type ChannelPushNotificationQueryParams = {
  channelId: string;
  enabled?: boolean;
};

export type UpdateChannelPushNotificationPayload = {
  channelId: string;
  isEnabled: boolean;
};

export function useChannelPushNotificationQuery({
  channelId,
  enabled = true,
}: ChannelPushNotificationQueryParams) {
  const { success, error } = useNotifications('chat');
  const muteSuccess = useString('amity_chat_action_mute');
  const muteError = useString('amity_chat_action_mute_failed');
  const unmuteSuccess = useString('amity_chat_action_unmute');
  const unmuteError = useString('amity_chat_action_unmute_failed');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [CHANNEL_PUSH_NOTIFICATION_QUERY_KEY, channelId],
    queryFn: () => Client.notifications().channel(channelId).getSettings(),
    enabled: enabled && !!channelId,
  });

  const { mutateAsync } = useMutation<void, Error, UpdateChannelPushNotificationPayload>({
    mutationFn: ({ channelId: id, isEnabled }) =>
      isEnabled
        ? Client.notifications().channel(id).enable()
        : Client.notifications().channel(id).disable(),
    onSuccess: (_, variables) => {
      refetch();
      success({
        content: variables.isEnabled ? unmuteSuccess : muteSuccess,
        alignment: 'fullscreen',
      });
    },
    onError: (_, variables) => {
      error({ content: variables.isEnabled ? unmuteError : muteError, alignment: 'fullscreen' });
    },
  });

  async function updateChannelPushNotification(
    payload: UpdateChannelPushNotificationPayload,
  ): Promise<void> {
    await mutateAsync(payload);
  }

  async function refresh(): Promise<void> {
    await refetch();
  }

  return {
    isEnabled: data?.isEnabled ?? true,
    isLoading,
    isError,
    refresh,
    updateChannelPushNotification,
  };
}
