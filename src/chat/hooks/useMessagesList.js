import { MessageRepository } from '@amityco/js-sdk';
import orderBy from 'lodash/orderBy';

import useLiveCollectionTemporaryIsolated from '~/core/hooks/useLiveCollectionTemporaryIsolated';

const messageRepo = new MessageRepository();

function useMessagesList(channelId) {
  const [messages, hasMore, loadMore] = useLiveCollectionTemporaryIsolated(
    'messageId',
    () => messageRepo.messagesForChannel({ channelId }),
    [channelId],
  );

  return [orderBy(messages, 'createdAt', 'desc'), hasMore, loadMore];
}

export default useMessagesList;
