import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { MemberRoles } from '~/v4/social/constants/memberRoles';

type UpdateChannelResponse = Awaited<ReturnType<typeof ChannelRepository.updateChannel>>;

type UpdateChannelPayload = {
  channelId: Parameters<typeof ChannelRepository.updateChannel>[0];
  moderators: string[];
  mutedMembers: string[];
  creatorId: string;
};

type UpdateChannelRoleResponse = Awaited<ReturnType<typeof ChannelRepository.Moderation.addRole>>;

type UpdateChannelRolePayload = {
  channelId: Parameters<typeof ChannelRepository.Moderation.addRole>[0];
  userIds: Parameters<typeof ChannelRepository.Moderation.addRole>[2];
};

export const useChatModeration = () => {
  const { confirm, info } = useConfirmContext();
  const notification = useNotifications();
  const { mutate: moderateChat } = useMutation<UpdateChannelResponse, Error, UpdateChannelPayload>({
    mutationFn: ({ channelId, moderators, mutedMembers }) => {
      return ChannelRepository.updateChannel(channelId, {
        metadata: {
          moderators,
          mutedMembers,
        },
      });
    },
  });

  const { mutate: addRole } = useMutation<
    UpdateChannelRoleResponse,
    Error,
    UpdateChannelRolePayload
  >({
    mutationFn: ({ channelId, userIds }) => {
      return ChannelRepository.Moderation.addRole(
        channelId,
        MemberRoles.CHANNEL_MODERATOR,
        userIds,
      );
    },
  });

  const { mutate: removeRole } = useMutation<
    UpdateChannelRoleResponse,
    Error,
    UpdateChannelRolePayload
  >({
    mutationFn: ({ channelId, userIds }) => {
      return ChannelRepository.Moderation.removeRole(
        channelId,
        MemberRoles.CHANNEL_MODERATOR,
        userIds,
      );
    },
  });

  const promoteToModerator = (payload: UpdateChannelPayload) => {
    info({
      type: 'info',
      okText: 'Promote',
      cancelText: 'Cancel',
      shownCancelButton: true,
      title: 'Moderator promotion',
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            addRole({
              channelId: payload.channelId,
              userIds: [payload.creatorId],
            });
            notification.success({ content: 'User promoted.', alignment: 'fullscreen' });
          },
          onError: () => {
            notification.info({
              content: 'Failed to promote user. Please try again.',
              alignment: 'fullscreen',
            });
          },
        }),
      content:
        'Are you sure you want to promote this member to moderator? They will gain access to all moderator permissions in this live stream.',
    });
  };

  const demoteFromModerator = (payload: UpdateChannelPayload) => {
    confirm({
      type: 'confirm',
      okText: 'Demote',
      cancelText: 'Cancel',
      title: 'Moderator demotion',
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            removeRole({
              channelId: payload.channelId,
              userIds: [payload.creatorId],
            });
            notification.success({ content: 'User demoted.', alignment: 'fullscreen' });
          },
          onError: () => {
            notification.info({
              content: 'Failed to demote user. Please try again.',
              alignment: 'fullscreen',
            });
          },
        }),
      content:
        'Are you sure you want to demote this moderator? They will lose access to all moderator permissions in this live stream.',
    });
  };

  const muteUser = (payload: UpdateChannelPayload) => {
    confirm({
      type: 'confirm',
      okText: 'Mute',
      cancelText: 'Cancel',
      title: 'Confirm mute',
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            notification.success({ content: 'User muted.', alignment: 'fullscreen' });
          },
          onError: () => {
            notification.info({
              content: 'Failed to mute user. Please try again.',
              alignment: 'fullscreen',
            });
          },
        }),
      content:
        'Are you sure you want to mute this user? They will no longer be able to send messages.',
    });
  };

  const unmuteUser = (payload: UpdateChannelPayload) => {
    info({
      type: 'info',
      okText: 'Unmute',
      cancelText: 'Cancel',
      title: 'Confirm unmute',
      shownCancelButton: true,
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            notification.success({ content: 'User unmuted.', alignment: 'fullscreen' });
          },
          onError: () => {
            notification.info({
              content: 'Failed to unmute user. Please try again.',
              alignment: 'fullscreen',
            });
          },
        }),
      content: 'Are you sure you want to unmute this user? They can now send messages.',
    });
  };

  return {
    promoteToModerator,
    demoteFromModerator,
    muteUser,
    unmuteUser,
  };
};
