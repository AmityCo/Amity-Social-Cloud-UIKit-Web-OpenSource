import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';

type DeleteParams = Parameters<typeof MessageRepository.deleteMessage>[0];

type DeleteResponse = Awaited<ReturnType<typeof MessageRepository.deleteMessage>>;

export type RequestDeleteOptions = {
  afterDelete?: () => void;
};

export type UseDeleteMessageQueryReturn = {
  requestDelete: (message: Amity.Message, options?: RequestDeleteOptions) => void;
};

export function useDeleteMessageQuery(): UseDeleteMessageQueryReturn {
  const { confirm, closeConfirm } = useConfirmContext();
  const { error } = useNotifications('chat');
  const deleteAlertTitle = useString('amity_chat_delete_alert_title');
  const deleteAlertMessage = useString('amity_chat_delete_alert_message');
  const deleteConfirm = useString('amity_chat_option_delete');
  const cancelLabel = useString('amity_chat_cancel');
  const deleteErrorToast = useString('amity_chat_toast_delete_error');

  const { mutateAsync } = useMutation<DeleteResponse, Error, DeleteParams>({
    mutationFn: MessageRepository.deleteMessage,
    networkMode: 'always',
  });

  function requestDelete(message: Amity.Message, options?: RequestDeleteOptions) {
    const messageId = message.messageId;
    if (!messageId) return;

    confirm({
      title: deleteAlertTitle,
      content: deleteAlertMessage,
      okText: deleteConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await mutateAsync(messageId, {
          onSuccess: () => {
            closeConfirm();
            options?.afterDelete?.();
          },
          onError: () => {
            closeConfirm();
            error({ content: deleteErrorToast });
          },
        });
      },
      onCancel: () => {
        closeConfirm();
      },
    });
  }

  return { requestDelete };
}
