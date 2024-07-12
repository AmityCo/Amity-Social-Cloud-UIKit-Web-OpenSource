import { StoryRepository, getCommunityStoriesTopic } from '@amityco/ts-sdk';
import useSubscription from '~/v4/core/hooks/subscriptions/useSubscription';

export default function useCommunityStoriesSubscription({
  targetId,
  targetType,
  shouldSubscribe = true,
  callback,
}: {
  targetId: string;
  targetType: Amity.StoryTargetType;
  shouldSubscribe?: boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: StoryRepository.getActiveStoriesByTarget,
    params: {
      targetId,
      targetType,
    },
    callback,
    shouldSubscribe: !!targetId && shouldSubscribe,
    getSubscribedTopic: () =>
      getCommunityStoriesTopic({
        targetId,
        targetType,
      }),
  });
}
