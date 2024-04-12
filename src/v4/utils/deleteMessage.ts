import { MessageRepository } from '@amityco/ts-sdk';

export const deleteMessage = (messageId: string) => MessageRepository.deleteMessage(messageId);
