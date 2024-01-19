import { ChannelRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

type UseChannelsListParams = Parameters<typeof ChannelRepository.getChannels>[0];

export default function useChannelsCollection(params: UseChannelsListParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: ChannelRepository.getChannels,
    params,
  });

  return {
    channels: items,
    ...rest,
  };
}
