import { ChannelRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof ChannelRepository.getChannels>[0];

type UseChannelCollectionOptions = {
  shouldCall?: boolean;
};

export default function useChannelCollection(
  params: Params,
  { shouldCall = true }: UseChannelCollectionOptions = {},
) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Channel, Params>({
    fetcher: ChannelRepository.getChannels,
    params,
    shouldCall,
  });

  return {
    ...rest,
    channels: items,
  };
}
