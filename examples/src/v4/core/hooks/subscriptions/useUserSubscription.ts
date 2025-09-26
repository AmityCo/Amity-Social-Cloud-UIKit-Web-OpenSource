import { UserRepository, getUserTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useUserSubscription({
  userId,
  level,
  shouldSubscribe = true,
  callback,
}: {
  userId?: string | null;
  level: Parameters<typeof getUserTopic>[1];
  shouldSubscribe?: boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: UserRepository.getUser,
    params: userId,
    callback,
    shouldSubscribe: !!userId && shouldSubscribe,
    getSubscribedTopic: ({ data: user }) => getUserTopic(user, level),
  });
}
