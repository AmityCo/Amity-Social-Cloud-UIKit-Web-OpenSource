import { ChannelRepository } from '@amityco/ts-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

const useChannel = (channelId?: string) => {
  return useLiveObject({
    fetcher: ChannelRepository.getChannel,
    params: channelId,
    shouldCall: () => !!channelId,
  });
};

export default useChannel;
