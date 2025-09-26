import { ChannelRepository } from '@amityco/ts-sdk';
import useChannelsCollection from './collections/useChannelsCollection';

type UseChannelsListParams = Parameters<typeof ChannelRepository.getChannels>[0];

function useChannelsList(params: UseChannelsListParams) {
  const { channels, hasMore, loadMore } = useChannelsCollection(params);

  return [channels, hasMore, loadMore];
}

export default useChannelsList;
