import { ChannelRepository, getChannelTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useChannelSubscription({
  channelId,
  shouldSubscribe = () => true,
  callback,
}: {
  channelId?: string | null;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: ChannelRepository.getChannel,
    params: channelId,
    callback,
    shouldSubscribe: () => !!channelId && shouldSubscribe(),
    getSubscribedTopic: ({ data: channel }) => getChannelTopic(channel),
  });
}
