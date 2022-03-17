import { MessageRepository } from '@amityco/js-sdk';
import orderBy from 'lodash/orderBy';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const messageRepo = new MessageRepository();

function useMessagesList(channelId) {
  const [messages, hasMore, loadMore] = useLiveCollection(
    () => messageRepo.messagesForChannel({ channelId }),
    [channelId],
  );

  return [orderBy(messages, 'createdAt', 'desc'), hasMore, loadMore];
}

export default useMessagesList;
