import { CommunityRepository, getCommunityTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useCommunitySubscription({
  communityId,
  level,
  shouldSubscribe = () => true,
  callback,
}: {
  communityId?: string | null;
  level: Parameters<typeof getCommunityTopic>[1];
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: CommunityRepository.getCommunity,
    params: communityId,
    callback,
    shouldSubscribe: () => !!communityId && shouldSubscribe(),
    getSubscribedTopic: ({ data: community }) => getCommunityTopic(community, level),
  });
}
