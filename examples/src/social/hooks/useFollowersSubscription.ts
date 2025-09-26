import { subscribeTopic } from '@amityco/ts-sdk';
import { useEffect, useRef } from 'react';
import useUser from '~/core/hooks/useUser';
import { getFollowersTopic } from '~/utils';

export default function useFollowersSubscription({
  userId,
  callback,
}: {
  userId?: string | null;
  callback?: Amity.Listener;
}) {
  const user = useUser(userId);
  const unSubRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (user == null) return;
    unSubRef.current = subscribeTopic(getFollowersTopic(user), callback);

    return () => {
      unSubRef.current?.();
    };
  }, []);
}
