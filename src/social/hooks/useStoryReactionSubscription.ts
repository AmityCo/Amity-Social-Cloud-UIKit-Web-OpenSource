import { StoryRepository, getCommunityStoriesTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useCommunityStoriesSubscription({
  targetId,
  targetType,
  shouldSubscribe = () => true,
  callback,
}: {
  targetId: string;
  targetType: string;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: StoryRepository.getActiveStoriesByTarget,
    params: {
      targetId,
      targetType,
    },
    callback,
    shouldSubscribe: () => !!targetId && shouldSubscribe(),
    getSubscribedTopic: () =>
      getCommunityStoriesTopic({
        targetId,
        targetType,
      }),
  });
}
