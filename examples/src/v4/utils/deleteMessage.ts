import { MessageRepository } from '@amityco/ts-sdk';

export const deleteMessage = async (
  messageId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  },
) => {
  try {
    await MessageRepository.deleteMessage(messageId);
    onSuccess && onSuccess();
  } catch (error) {
    onError && onError(error);
  }
};
