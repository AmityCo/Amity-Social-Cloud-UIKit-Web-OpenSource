import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

const useChannelRole = ({ channel }: { channel?: Amity.Channel | null }) => {
  const channelId = channel?.channelId;
  const { success, info } = useNotifications('chat');

  const { mutate: assingRoleToUsers } = useMutation({
    mutationFn: ({ userIds, roleId }: { userIds: string[]; roleId: string }) =>
      channelId
        ? ChannelRepository.Moderation.addRole(channelId, roleId, userIds)
        : Promise.resolve(false),
    onSuccess: () => success({ content: resolveString('amity_chat_toast_moderator_promoted') }),
    onError: () => info({ content: resolveString('amity_chat_toast_moderator_promoted') }),
  });

  const { mutate: removeRoleFromUsers } = useMutation({
    mutationFn: ({ userIds, roleId }: { userIds: string[]; roleId: string }) =>
      channelId
        ? ChannelRepository.Moderation.removeRole(channelId, roleId, userIds)
        : Promise.resolve(false),
    onSuccess: () => success({ content: resolveString('amity_chat_toast_moderator_promoted') }),
    onError: () => info({ content: resolveString('amity_chat_toast_moderator_promoted') }),
  });

  return {
    assingRoleToUsers,
    removeRoleFromUsers,
  };
};

export default useChannelRole;
