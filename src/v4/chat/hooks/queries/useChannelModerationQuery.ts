import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { MemberRoles } from '~/v4/chat/constants/memberRoles';

type Params = Parameters<typeof ChannelRepository.Moderation.addRole>;

export type ChannelModerationPayload = {
  channelId: Params[0];
  userIds: Params[2];
};

type Response = Awaited<ReturnType<typeof ChannelRepository.Moderation.addRole>>;

export function useChannelModerationQuery() {
  const { error } = useNotifications();
  const promoteErrorToast = useString('amity_chat_action_promote_member_failed');
  const demoteErrorToast = useString('amity_chat_action_demote_member_failed');

  const promoteMutation = useMutation<Response, Error, ChannelModerationPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Moderation.addRole(channelId, MemberRoles.CHANNEL_MODERATOR, userIds),
    onError: () => {
      error({ content: promoteErrorToast });
    },
  });

  const demoteMutation = useMutation<Response, Error, ChannelModerationPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Moderation.removeRole(channelId, MemberRoles.CHANNEL_MODERATOR, userIds),
    onError: () => {
      error({ content: demoteErrorToast });
    },
  });

  async function promoteModerator(payload: ChannelModerationPayload): Promise<void> {
    await promoteMutation.mutateAsync(payload);
  }

  async function demoteModerator(payload: ChannelModerationPayload): Promise<void> {
    await demoteMutation.mutateAsync(payload);
  }

  return { promoteModerator, demoteModerator };
}
