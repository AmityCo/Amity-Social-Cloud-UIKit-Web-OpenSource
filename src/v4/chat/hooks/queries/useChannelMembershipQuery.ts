import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type Params = Parameters<typeof ChannelRepository.Membership.addMembers>;

export type ChannelMembershipPayload = {
  channelId: Params[0];
  userIds: Params[1];
};

type Response = Awaited<ReturnType<typeof ChannelRepository.Membership.addMembers>>;

export function useChannelMembershipQuery() {
  const { error } = useNotifications('chat');
  const addMembersErrorToast = useString('amity_chat_toast_members_add_error');
  const addMemberErrorToast = useString('amity_chat_add_group_member_toast_failed');
  const removeErrorToast = useString('amity_chat_action_remove_member_failed');

  const addMutation = useMutation<Response, Error, ChannelMembershipPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Membership.addMembers(channelId, userIds),
    onError: (_, payload) => {
      const isMultiple = payload.userIds.length > 1;
      error({
        content: isMultiple ? addMembersErrorToast : addMemberErrorToast,
        alignment: 'fullscreen',
      });
    },
  });

  const removeMutation = useMutation<Response, Error, ChannelMembershipPayload>({
    mutationFn: ({ channelId, userIds }) =>
      ChannelRepository.Membership.removeMembers(channelId, userIds),
    onError: () => {
      error({ content: removeErrorToast, alignment: 'fullscreen' });
    },
  });

  async function addMembers(payload: ChannelMembershipPayload): Promise<void> {
    await addMutation.mutateAsync(payload);
  }

  async function removeMembers(payload: ChannelMembershipPayload): Promise<void> {
    await removeMutation.mutateAsync(payload);
  }

  return { addMembers, removeMembers };
}
