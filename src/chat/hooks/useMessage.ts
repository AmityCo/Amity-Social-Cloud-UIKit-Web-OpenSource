import { MessageRepository } from '@amityco/ts-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

const useMessage = (messageId?: string) => {
  return useLiveObject({
    fetcher: MessageRepository.getMessage,
    params: messageId,
    shouldCall: () => !!messageId,
  });
};

export default useMessage;
