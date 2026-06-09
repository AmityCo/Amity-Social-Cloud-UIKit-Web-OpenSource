import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type Params = Parameters<typeof ChannelRepository.leaveChannel>;

export type ChannelLeavePayload = {
  channelId: Params[0];
};

type Response = Awaited<ReturnType<typeof ChannelRepository.leaveChannel>>;

export function useLeaveChannelQuery() {
  const { error } = useNotifications();
  const errorToast = useString('amity_chat_action_leave_group_failed');

  const leaveMutation = useMutation<Response, Error, ChannelLeavePayload>({
    mutationFn: ({ channelId }) => ChannelRepository.leaveChannel(channelId),
    onError: () => {
      error({ content: errorToast });
    },
  });

  async function leaveChannel(payload: ChannelLeavePayload): Promise<void> {
    await leaveMutation.mutateAsync(payload);
  }

  return { leaveChannel };
}
