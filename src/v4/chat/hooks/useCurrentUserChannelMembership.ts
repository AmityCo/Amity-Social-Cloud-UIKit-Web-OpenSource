import { useEffect, useRef } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useSearchChannelUser } from '~/v4/chat/hooks/collections/useSearchChannelUser';

/**
 * Observes the current user's membership (roles, membership status) on a channel.
 *
 * Channel role changes are not reliably delivered over MQTT, so callers can pass
 * a `refreshKey` derived from data that *is* delivered in realtime (e.g. the
 * channel's `metadata.moderators`, which arrives via the documented
 * `channel.updated` event). Whenever the key changes, the membership is
 * re-queried over HTTP so roles stay in sync without an MQTT role event.
 */
const useCurrentUserChannelMembership = (
  channelId: Amity.Channel['channelId'],
  { enabled = true, refreshKey }: { enabled?: boolean; refreshKey?: string } = {},
) => {
  const { currentUserId } = useSDK();
  const { channelMembers, isLoading, refresh } = useSearchChannelUser({
    channelId,
    memberships: ['member', 'banned', 'muted'],
    search: currentUserId,
    shouldCall: enabled,
  });

  const lastRefreshKey = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!enabled || refreshKey === undefined) return;
    // First defined key is the state the initial fetch already reflects.
    if (lastRefreshKey.current === undefined) {
      lastRefreshKey.current = refreshKey;
      return;
    }
    if (lastRefreshKey.current === refreshKey) return;
    lastRefreshKey.current = refreshKey;
    refresh();
  }, [refreshKey, enabled, refresh]);

  // Keep returning the last known membership during a refresh so consumers
  // (e.g. the moderator badge) don't flicker while the re-query is in flight.
  const membership = isLoading && !channelMembers?.length ? null : channelMembers?.[0] ?? null;

  return { membership, refresh };
};

export default useCurrentUserChannelMembership;
