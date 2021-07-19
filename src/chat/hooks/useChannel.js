import { ChannelRepository } from '@amityco/js-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useChannel = (channelId, dependencies = [channelId], resolver = undefined) => {
  return useLiveObject(() => ChannelRepository.getChannel(channelId), dependencies, resolver);
};

export default useChannel;
