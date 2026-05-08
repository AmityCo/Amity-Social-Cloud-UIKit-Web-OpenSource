import { ChannelRepository } from '@amityco/ts-sdk';
import { resolveString } from '~/v4/core/localization';
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
      okText: resolveString('amity_social_button_promote'),
      cancelText: resolveString('amity_social_button_cancel'),
      shownCancelButton: true,
      title: resolveString('amity_social_modal_dialog_title_moderator_promotion'),
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            addRole({
              channelId: payload.channelId,
              userIds: [payload.creatorId],
            });
            notification.success({
              content: resolveString('amity_social_toast_snackbar_user_promoted'),
              alignment: 'live-chat',
            });
          },
          onError: () => {
            notification.info({
              content: resolveString('amity_social_toast_user_promoted_failed'),
              alignment: 'live-chat',
            });
          },
        }),
      content: resolveString('amity_social_modal_dialog_promote_moderator_description'),
    });
  };

  const demoteFromModerator = (payload: UpdateChannelPayload) => {
    confirm({
      type: 'confirm',
      okText: resolveString('amity_social_button_demote'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_modal_dialog_title_moderator_demotion'),
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            removeRole({
              channelId: payload.channelId,
              userIds: [payload.creatorId],
            });
            notification.success({
              content: resolveString('amity_social_label_user_demoted'),
              alignment: 'live-chat',
            });
          },
          onError: () => {
            notification.info({
              content: resolveString('amity_social_toast_user_demoted_failed'),
              alignment: 'live-chat',
            });
          },
        }),
      content: resolveString('amity_social_modal_dialog_demote_moderator_description'),
    });
  };

  const muteUser = (payload: UpdateChannelPayload) => {
    confirm({
      type: 'confirm',
      okText: resolveString('amity_social_button_mute'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_modal_dialog_title_confirm_mute'),
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            notification.success({
              content: resolveString('amity_social_button_user_muted'),
              alignment: 'live-chat',
            });
          },
          onError: () => {
            notification.info({
              content: resolveString('amity_social_toast_user_muted_failed'),
              alignment: 'live-chat',
            });
          },
        }),
      content: resolveString('amity_social_modal_dialog_mute_user_description'),
    });
  };

  const unmuteUser = (payload: UpdateChannelPayload) => {
    info({
      type: 'info',
      okText: resolveString('amity_social_button_unmute'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_modal_dialog_title_confirm_unmute'),
      shownCancelButton: true,
      onOk: () =>
        moderateChat(payload, {
          onSuccess: () => {
            notification.success({
              content: resolveString('amity_social_button_user_unmuted'),
              alignment: 'live-chat',
            });
          },
          onError: () => {
            notification.info({
              content: resolveString('amity_social_toast_user_unmuted_failed'),
              alignment: 'live-chat',
            });
          },
        }),
      content: resolveString('amity_social_modal_dialog_unmute_user_description'),
    });
  };

  return {
    promoteToModerator,
    demoteFromModerator,
    muteUser,
    unmuteUser,
    moderateChat,
  };
};
