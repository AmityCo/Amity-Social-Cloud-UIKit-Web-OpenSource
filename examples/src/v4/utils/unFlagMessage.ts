import { MessageRepository } from '@amityco/ts-sdk';

export const unFlagMessage = async (
  messageId: string,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
) => {
  try {
    await MessageRepository.unflagMessage(messageId);
    onSuccess && onSuccess();
  } catch (error) {
    onError && onError(error);
  }
};
