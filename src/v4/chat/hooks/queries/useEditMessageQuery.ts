import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { handleTextMessageError } from '~/v4/chat/utils/handleTextMessageError';

type EditMessageFn = typeof MessageRepository.editMessage;

type EditPatch = Parameters<EditMessageFn>[1];

type EditParams = {
  messageId: Amity.Message['messageId'];
  patch: EditPatch;
};

type EditResponse = Awaited<ReturnType<EditMessageFn>>;

export type RequestEditOptions = {
  onSuccess?: () => void;
  metadata?: EditPatch['metadata'];
  mentionees?: EditPatch['mentionees'];
};

export type UseEditMessageQueryReturn = {
  requestEdit: (
    message: Amity.Message,
    newText: string,
    options?: RequestEditOptions,
  ) => Promise<void>;
};

export function useEditMessageQuery(): UseEditMessageQueryReturn {
  const { error: errorToast } = useNotifications('chat');
  const { info } = useConfirmContext();

  const { mutateAsync } = useMutation<EditResponse, Error, EditParams>({
    mutationFn: ({ messageId, patch }) => MessageRepository.editMessage(messageId, patch),
  });

  async function requestEdit(
    message: Amity.Message,
    newText: string,
    options?: RequestEditOptions,
  ) {
    const messageId = message.messageId;
    if (!messageId) return;
    const trimmed = newText.trim();
    if (trimmed.length === 0) return;

    const patch: EditPatch = {
      data: { text: trimmed },
      metadata: options?.metadata ?? message.metadata,
      mentionees: options?.mentionees ?? message.mentionees,
    };

    await mutateAsync(
      { messageId, patch },
      {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: (err) => {
          handleTextMessageError(err, { errorToast, info });
        },
      },
    );
  }

  return { requestEdit };
}
