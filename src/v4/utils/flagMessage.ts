import { MessageRepository } from '@amityco/ts-sdk';

export const flagMessage = (messageId: string) => MessageRepository.flagMessage(messageId);
