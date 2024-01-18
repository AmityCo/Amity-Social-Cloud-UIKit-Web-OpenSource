import { MessageRepository } from '@amityco/js-sdk';
import orderBy from 'lodash/orderBy';

import useLiveCollection from '~/core/hooks/useLiveCollection';

function useMessagesList(channelId) {
  const [messages, hasMore, loadMore] = useLiveCollection(
    () => MessageRepository.queryMessages({ channelId }),
    [channelId],
  );

  return [orderBy(messages, 'createdAt', 'desc'), hasMore, loadMore];
}

export default useMessagesList;
