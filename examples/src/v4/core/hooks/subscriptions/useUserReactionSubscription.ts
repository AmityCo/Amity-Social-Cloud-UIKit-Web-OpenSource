import { SubscriptionLevels } from '@amityco/ts-sdk';
import useUserSubscription from './useUserSubscription';

export default function useUserReactionSubscription({
  userId,
  callback,
  shouldSubscribe = true,
}: {
  userId?: string | null;
  shouldSubscribe?: boolean;
  callback?: Amity.Listener;
}) {
  return useUserSubscription({
    userId,
    level: SubscriptionLevels.POST_AND_COMMENT,
    shouldSubscribe,
    callback,
  });
}
