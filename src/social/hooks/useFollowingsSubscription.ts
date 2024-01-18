import { subscribeTopic } from '@amityco/ts-sdk';
import { useEffect, useRef } from 'react';
import useUser from '~/core/hooks/useUser';
import { getFollowingsTopic } from '~/utils';

export default function useFollowingsSubscription({
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
    unSubRef.current = subscribeTopic(getFollowingsTopic(user), callback);

    return () => {
      unSubRef.current?.();
    };
  }, []);
}
