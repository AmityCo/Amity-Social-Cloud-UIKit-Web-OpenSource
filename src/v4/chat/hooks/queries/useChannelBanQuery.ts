import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type Params = Parameters<typeof ChannelRepository.Moderation.banMembers>;

export type ChannelBanPayload = {
  channelId: Params[0];
  userIds: Params[1];
};

type Response = Awaited<ReturnType<typeof ChannelRepository.Moderation.banMembers>>;

export function useChannelBanQuery() {
  const { error } = useNotifications();
  const banErrorToast = useString('amity_chat_action_ban_member_failed');
  const unbanErrorToast = useString('amity_chat_action_unban_user_failed');

  const banMutation = useMutation<Response, Error, ChannelBanPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Moderation.banMembers(channelId, userIds),
    onError: () => {
      error({ content: banErrorToast, alignment: 'fullscreen' });
    },
  });

  const unbanMutation = useMutation<Response, Error, ChannelBanPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Moderation.unbanMembers(channelId, userIds),
    onError: () => {
      error({ content: unbanErrorToast, alignment: 'fullscreen' });
    },
  });

  async function banUser(payload: ChannelBanPayload): Promise<void> {
    await banMutation.mutateAsync(payload);
  }

  async function unbanUser(payload: ChannelBanPayload): Promise<void> {
    await unbanMutation.mutateAsync(payload);
  }

  return { banUser, unbanUser };
}
