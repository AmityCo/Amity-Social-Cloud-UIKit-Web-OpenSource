import { ChannelRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof ChannelRepository.getArchivedChannels>[0];

export function useArchivedChannelsCollection(params: Params = {}) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Channel, Params>({
    fetcher: ChannelRepository.getArchivedChannels,
    params,
  });

  return {
    ...rest,
    channels: items,
  };
}
