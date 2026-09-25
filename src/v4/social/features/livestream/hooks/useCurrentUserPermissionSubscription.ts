import { getUserTopic, subscribeTopic } from '@amityco/ts-sdk';
import { useEffect } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import useUser from '~/v4/core/hooks/objects/useUser';

/**
 * Network-scope permission changes for the current user
 * (Implementation Plan 39 v1.9 "Option B"; AmityLivestreamChatFeed v2 REQ-081 / REQ-086).
 *
 * A permission change made from the Console is network-scoped and arrives on `user.updated`.
 * The SDK ingests that payload into the current user's cached `permissions` — the network arm
 * that `hasPermission(PIN_MESSAGE).channel()` unions with the channel arm — but it does NOT
 * auto-subscribe the current user's own `.user` topic, so the event never reaches the client
 * unless a screen subscribes it. The livestream screen does so for as long as it is mounted
 * and unsubscribes on exit.
 *
 * Tradeoff accepted by the plan: this is a manual subscription, so it is NOT re-applied on
 * MQTT reconnect. A revoke that lands during a reconnect window propagates once the screen is
 * rebuilt, or through the 403 backstop on a stale Pin / "X" tap.
 *
 * The observed current-user live object is returned so `canPin` consumers can recompute the
 * permission arm when the event lands (the SDK live object emits on `user.updated`).
 */
export const useCurrentUserPermissionSubscription = () => {
  const { currentUserId } = useSDK();
  const { user: currentUser } = useUser({ userId: currentUserId });

  const userPath = currentUser?.path;

  useEffect(() => {
    if (!userPath) return;

    const unsubscribe = subscribeTopic(getUserTopic({ path: userPath }));

    return () => unsubscribe();
  }, [userPath]);

  return { currentUser };
};
