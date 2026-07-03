import { ChannelRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UseChannelObjectParams = {
  channelId?: string;
};

export function useChannelObject({ channelId }: UseChannelObjectParams) {
  const { item, isLoading, error } = useLiveObjectV4<string, Amity.Channel, never>({
    fetcher: ChannelRepository.getChannel,
    params: channelId ?? '',
    shouldCall: !!channelId,
  });

  return {
    channel: item,
    isLoading,
    error,
  };
}
