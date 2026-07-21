import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type UpdateChannelParams = Parameters<typeof ChannelRepository.updateChannel>;

type UpdateChannelResponse = Awaited<ReturnType<typeof ChannelRepository.updateChannel>>;

export type UpdateChannelPayload = {
  channelId: UpdateChannelParams[0];
  payload: UpdateChannelParams[1];
};

type UseUpdateChannelQueryParams = {
  errorToast?: ReactNode;
};

export function useUpdateChannelQuery({ errorToast }: UseUpdateChannelQueryParams = {}) {
  const { error } = useNotifications('chat');
  const defaultErrorToast = useString('amity_chat_group_edit_profile_failed');
  const resolvedErrorToast = errorToast ?? defaultErrorToast;

  const { mutateAsync } = useMutation<UpdateChannelResponse, Error, UpdateChannelPayload>({
    mutationFn: ({ channelId, payload }) => ChannelRepository.updateChannel(channelId, payload),
    onError: () => {
      error({ content: resolvedErrorToast });
    },
  });

  async function updateChannel(payload: UpdateChannelPayload): Promise<void> {
    await mutateAsync(payload);
  }

  return { updateChannel };
}
