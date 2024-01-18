import useCommunityReactionSubscription from './useCommunityReactionSubscription';
import useUserReactionSubscription from './useUserReactionSubscription';

export default function useReactionSubscription({
  targetId,
  targetType,
  callback,
  shouldSubscribe = () => true,
}: {
  targetId?: string | null;
  targetType: 'user' | 'community';
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  const { unsubscribe: userUnsubscribe } = useUserReactionSubscription({
    userId: targetId,
    shouldSubscribe: () => shouldSubscribe() && targetType === 'user',
    callback,
  });

  const { unsubscribe: communityUnsubscribe } = useCommunityReactionSubscription({
    communityId: targetId,
    shouldSubscribe: () => shouldSubscribe() && targetType === 'community',
    callback,
  });

  return {
    unsubscribe() {
      userUnsubscribe();
      communityUnsubscribe();
    },
  };
}
