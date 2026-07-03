import { ChannelRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof ChannelRepository.searchChannels>[0];

type UseSearchChannelsCollectionOptions = {
  shouldCall?: boolean;
};

export default function useSearchChannelsCollection(
  params: Params,
  { shouldCall = true }: UseSearchChannelsCollectionOptions = {},
) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Channel, Params>({
    fetcher: ChannelRepository.searchChannels,
    params,
    shouldCall,
  });

  return {
    ...rest,
    channels: items,
  };
}
