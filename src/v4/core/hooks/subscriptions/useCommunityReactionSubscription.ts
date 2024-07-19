import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunitySubscription from './useCommunitySubscription';

export default function useCommunityReactionSubscription({
  communityId,
  shouldSubscribe = () => true,
  callback,
}: {
  communityId?: string | null;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useCommunitySubscription({
    communityId,
    level: SubscriptionLevels.POST_AND_COMMENT,
    shouldSubscribe,
    callback,
  });
}
