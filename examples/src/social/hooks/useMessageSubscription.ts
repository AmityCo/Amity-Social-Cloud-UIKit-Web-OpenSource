import { MessageRepository, getMessageTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useMessageSubscription({
  messageId,
  shouldSubscribe = () => true,
  callback,
}: {
  messageId?: string | null;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: MessageRepository.getMessage,
    params: messageId,
    callback,
    shouldSubscribe: () => !!messageId && shouldSubscribe(),
    getSubscribedTopic: ({ data: message }) => getMessageTopic(message),
  });
}
