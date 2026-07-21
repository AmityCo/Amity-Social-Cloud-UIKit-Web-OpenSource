import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useString } from '~/v4/core/localization';

type Params = Parameters<typeof ChannelRepository.archiveChannel>;

export type ChannelArchivePayload = {
  channelId: Params[0];
};

type Response = Awaited<ReturnType<typeof ChannelRepository.archiveChannel>>;

export function useChannelArchiveQuery() {
  const { error, success } = useNotifications('chat');
  const { info } = useConfirmContext();
  const archiveLimitTitle = useString('amity_chat_archive_limit_title');
  const archiveLimitMessage = useString('amity_chat_archive_limit_message');
  const okLabel = useString('amity_chat_button_ok');
  const archiveErrorToast = useString('amity_chat_archive_error_toast');
  const unarchiveErrorToast = useString('amity_chat_unarchive_error_toast');
  const archivedSuccessToast = useString('amity_chat_archived_toast');
  const unarchiveSuccessToast = useString('amity_chat_unarchived_toast');

  const archiveMutation = useMutation<Response, Error, ChannelArchivePayload>({
    mutationFn: ({ channelId }) => ChannelRepository.archiveChannel(channelId),
    onSuccess: () => {
      success({ content: archivedSuccessToast });
    },
    onError: (err) => {
      if (err.message?.includes('Archive limit exceeded')) {
        info({
          title: archiveLimitTitle,
          content: archiveLimitMessage,
          okText: okLabel,
        });
        return;
      }
      error({ content: archiveErrorToast });
    },
  });

  const unarchiveMutation = useMutation<Response, Error, ChannelArchivePayload>({
    mutationFn: ({ channelId }) => ChannelRepository.unarchiveChannel(channelId),
    onSuccess: () => {
      success({ content: unarchiveSuccessToast });
    },
    onError: () => {
      error({ content: unarchiveErrorToast });
    },
  });

  async function archiveChannel(payload: ChannelArchivePayload): Promise<void> {
    await archiveMutation.mutateAsync(payload);
  }

  async function unarchiveChannel(payload: ChannelArchivePayload): Promise<void> {
    await unarchiveMutation.mutateAsync(payload);
  }

  return { archiveChannel, unarchiveChannel };
}
