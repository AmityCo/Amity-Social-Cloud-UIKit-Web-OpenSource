import { ChannelRepository, ChannelFilter } from '@amityco/js-sdk';
import orderBy from 'lodash/orderBy';

import useLiveCollectionTemporaryIsolated from '~/core/hooks/useLiveCollectionTemporaryIsolated';

function useChannelsList() {
  const [channels, hasMore, loadMore] = useLiveCollectionTemporaryIsolated(
    'channelId',
    // Note: we can not use SDK sortBy LastActivity option - because by default it uses
    // ASC direction from BE. By default LastCreated is used. It still gives wrong result but it
    // better.
    () => ChannelRepository.queryChannels({ filter: ChannelFilter.Member }),
    [],
  );

  return [orderBy(channels, 'lastActivity', 'desc'), hasMore, loadMore];
}

export default useChannelsList;
