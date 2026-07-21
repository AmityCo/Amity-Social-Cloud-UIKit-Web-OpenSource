import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

export enum AmityChannelMessagingPermissionEnum {
  Everyone = 'everyone',
  ModeratorsOnly = 'moderatorsOnly',
}

export type UpdateChannelMutePermissionPayload = {
  channelId: string;
  permission: AmityChannelMessagingPermissionEnum;
};

const INDEFINITE_MUTE_PERIOD = -1;

export function useUpdateChannelMutePermissionQuery() {
  const { error } = useNotifications('chat');
  const errorToast = useString('amity_chat_edit_group_perm_toast_failed');

  const { mutateAsync } = useMutation<boolean, Error, UpdateChannelMutePermissionPayload>({
    mutationFn: ({ channelId, permission }) =>
      permission === AmityChannelMessagingPermissionEnum.ModeratorsOnly
        ? ChannelRepository.muteChannel(channelId, INDEFINITE_MUTE_PERIOD)
        : ChannelRepository.unmuteChannel(channelId),
    onError: () => {
      error({ content: errorToast });
    },
  });

  async function updateChannelMutePermission(
    payload: UpdateChannelMutePermissionPayload,
  ): Promise<void> {
    await mutateAsync(payload);
  }

  return { updateChannelMutePermission };
}
