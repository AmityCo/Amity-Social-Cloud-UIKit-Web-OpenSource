import { MessageRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UseMessageObjectParams = {
  messageId?: string | null;
  calledOnce?: boolean;
};

export function useMessageObject({ messageId, calledOnce }: UseMessageObjectParams) {
  const { item, isLoading, error } = useLiveObjectV4<string, Amity.Message, never>({
    fetcher: MessageRepository.getMessage,
    params: messageId ?? '',
    shouldCall: !!messageId,
    calledOnce: calledOnce,
  });

  return {
    message: item,
    isLoading,
    error,
  };
}
