import { SubChannelRepository, getSubChannelTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useSubChannelSubscription({
  subChannelId,
  shouldSubscribe = () => true,
  callback,
}: {
  subChannelId?: string | null;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: SubChannelRepository.getSubChannel,
    params: subChannelId,
    callback,
    shouldSubscribe: () => !!subChannelId && shouldSubscribe(),
    getSubscribedTopic: ({ data: subChannel }) => getSubChannelTopic(subChannel),
  });
}
