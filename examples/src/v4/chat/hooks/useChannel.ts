import { ChannelRepository } from '@amityco/ts-sdk';
import useLiveObject from '~/v4/core/hooks/useLiveObject';

export const useChannel = ({ channelId }: { channelId?: string }) => {
  const { item, ...rest } = useLiveObject({
    fetcher: ChannelRepository.getChannel,
    params: channelId,
    shouldCall: !!channelId,
  });

  return { channel: item, ...rest };
};
