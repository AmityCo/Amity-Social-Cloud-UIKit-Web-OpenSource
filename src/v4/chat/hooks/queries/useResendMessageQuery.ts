import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';

type CreateParams = Parameters<typeof MessageRepository.createMessage>[0];

type CreateResponse = Awaited<ReturnType<typeof MessageRepository.createMessage>>;

type DeleteParams = Parameters<typeof MessageRepository.deleteMessage>[0];

type DeleteResponse = Awaited<ReturnType<typeof MessageRepository.deleteMessage>>;

export type RequestResendOptions = {
  afterResend?: () => void;
};

export type UseResendMessageQueryReturn = {
  requestResend: (message: Amity.Message, options?: RequestResendOptions) => Promise<void>;
};

export function useResendMessageQuery(): UseResendMessageQueryReturn {
  const { mutateAsync: createMessageMutation } = useMutation<CreateResponse, Error, CreateParams>({
    mutationFn: MessageRepository.createMessage,
  });

  const { mutateAsync: deleteMessageMutation } = useMutation<DeleteResponse, Error, DeleteParams>({
    mutationFn: MessageRepository.deleteMessage,
  });

  async function requestResend(message: Amity.Message, options?: RequestResendOptions) {
    await createMessageMutation(
      {
        subChannelId: message.subChannelId,
        dataType: message.dataType,
        data: message.data,
        parentId: message.parentId,
      },
      {
        onSuccess: async () => {
          if (message.messageId) {
            await deleteMessageMutation(message.messageId);
          }
          options?.afterResend?.();
        },
      },
    );
  }

  return { requestResend };
}
