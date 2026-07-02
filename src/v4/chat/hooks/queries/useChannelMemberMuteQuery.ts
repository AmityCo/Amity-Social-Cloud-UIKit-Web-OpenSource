import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

type ChannelMemberMutePayload = {
  channelId: Parameters<typeof ChannelRepository.Moderation.muteMembers>[0];
  userId: string;
};

type MuteOptions = {
  onSuccess?: () => void;
};

type MuteResponse = Awaited<ReturnType<typeof ChannelRepository.Moderation.muteMembers>>;

type UnmuteResponse = Awaited<ReturnType<typeof ChannelRepository.Moderation.unmuteMembers>>;

export function useChannelMemberMuteQuery() {
  const { confirm, closeConfirm } = useConfirmContext();
  const { success, error } = useNotifications();

  const muteMutation = useMutation<MuteResponse, Error, ChannelMemberMutePayload>({
    mutationFn: ({ channelId, userId }) =>
      ChannelRepository.Moderation.muteMembers(channelId, [userId]),
    onSuccess: () => {
      success({ content: resolveString('amity_chat_action_mute_user'), alignment: 'fullscreen' });
    },
    onError: () => {
      error({
        content: resolveString('amity_chat_action_mute_user_failed'),
        alignment: 'fullscreen',
      });
    },
  });

  const unmuteMutation = useMutation<UnmuteResponse, Error, ChannelMemberMutePayload>({
    mutationFn: ({ channelId, userId }) =>
      ChannelRepository.Moderation.unmuteMembers(channelId, [userId]),
    onSuccess: () => {
      success({ content: resolveString('amity_chat_action_unmute_user'), alignment: 'fullscreen' });
    },
    onError: () => {
      error({
        content: resolveString('amity_chat_action_unmute_user_failed'),
        alignment: 'fullscreen',
      });
    },
  });

  function mute(payload: ChannelMemberMutePayload, options?: MuteOptions) {
    confirm({
      title: resolveString('amity_chat_mute_confirm_title'),
      content: resolveString('amity_chat_mute_confirm_message'),
      okText: resolveString('amity_chat_mute_confirm_label'),
      cancelText: resolveString('amity_chat_cancel'),
      okButtonColor: 'alert',
      onOk: async () => {
        await muteMutation.mutateAsync(payload, {
          onSuccess: () => {
            closeConfirm();
            options?.onSuccess?.();
          },
          onError: () => closeConfirm(),
        });
      },
      onCancel: () => closeConfirm(),
    });
  }

  function unmute(payload: ChannelMemberMutePayload, options?: MuteOptions) {
    confirm({
      title: resolveString('amity_chat_unmute_confirm_title'),
      content: resolveString('amity_chat_unmute_confirm_message'),
      okText: resolveString('amity_chat_unmute_confirm_label'),
      cancelText: resolveString('amity_chat_cancel'),
      okButtonColor: 'primary',
      onOk: async () => {
        await unmuteMutation.mutateAsync(payload, {
          onSuccess: () => {
            closeConfirm();
            options?.onSuccess?.();
          },
          onError: () => closeConfirm(),
        });
      },
      onCancel: () => closeConfirm(),
    });
  }

  return { mute, unmute };
}
