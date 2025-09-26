import { MessageRepository } from '@amityco/ts-sdk';

export const flagMessage = async (
  messageId: string,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
) => {
  try {
    await MessageRepository.flagMessage(messageId);
    onSuccess && onSuccess();
  } catch (error) {
    onError && onError(error);
  }
};
