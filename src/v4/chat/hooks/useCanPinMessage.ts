import { ChannelRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { Permissions } from '~/v4/social/constants/permissions';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { computeCanPinMessage } from '~/v4/chat/utils/computeCanPinMessage';

export interface UseCanPinMessageParams {
  channelId?: Amity.Channel['channelId'];
  /**
   * Live channel object held by the feed. Passing it makes the permission check
   * re-run on every channel emission — including the one the SDK triggers when it
   * refreshes the current user's channel permissions after a 403 (REQ-086).
   */
  channel?: Amity.Channel | null;
  /** Current user's channel membership; re-checks the permission when roles change. */
  membership?: Amity.Membership<'channel'> | null;
}

/**
 * Reactive `canPin` for the pin item in the message ⋮ menu and the "X" on the
 * pinned message banner (AmityLivestreamChatFeed v2 REQ-080 / REQ-081).
 *
 * Host / co-host and room status come from the observed room (LivestreamDataProvider);
 * the permission arm reads the SDK cache, so it is recomputed whenever the live channel
 * or the current user's membership changes.
 */
/**
 * Re-read a channel so the SDK refreshes the current user's cached channel permissions
 * (`channelUsers[...].permissions`, read by `hasPermission(...).channel()`). Mirrors what
 * the SDK does itself after a 403 on pin / unpin. One request per channel at a time: every
 * message bubble in the feed calls `useCanPinMessage`, so they share the in-flight read.
 */
const inflightRefreshes = new Map<Amity.Channel['channelId'], Promise<void>>();

const refreshChannelPermissions = (channelId: Amity.Channel['channelId']) => {
  const inflight = inflightRefreshes.get(channelId);
  if (inflight) return inflight;

  const refresh = new Promise<void>((resolve) => {
    let settled = false;
    const observer: { unsubscribe?: Amity.Unsubscriber } = {};
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.unsubscribe?.();
      resolve();
    };
    try {
      observer.unsubscribe = ChannelRepository.getChannel(channelId, ({ loading }) => {
        if (!loading) finish();
      });
      // Cache hit: the callback may already have run before `unsubscribe` was assigned.
      if (settled) observer.unsubscribe();
    } catch {
      finish();
    }
  }).finally(() => inflightRefreshes.delete(channelId));

  inflightRefreshes.set(channelId, refresh);
  return refresh;
};

export const useCanPinMessage = ({ channelId, channel, membership }: UseCanPinMessageParams) => {
  const { client, currentUserId } = useSDK();
  const { room, hostId, coHostId } = useLivestreamData();

  const isHost = !!currentUserId && hostId === currentUserId;
  const isCoHost = !!currentUserId && coHostId === currentUserId;
  const isStreamer = isHost || isCoHost;

  // Demotion (co-host → viewer): the room live object drops the participant right away, but
  // the channel role the server revokes with it stays in the SDK's permission cache until
  // the channel is read again. Without this the "Pin message" item and the banner "X" would
  // linger until the user hit a 403. Re-read once when the current user stops being a
  // streamer, then recompute the permission arm.
  const [permissionsVersion, setPermissionsVersion] = useState(0);
  const wasStreamerRef = useRef(isStreamer);
  useEffect(() => {
    const wasStreamer = wasStreamerRef.current;
    wasStreamerRef.current = isStreamer;
    if (!wasStreamer || isStreamer || !channelId) return;

    let cancelled = false;
    refreshChannelPermissions(channelId).then(() => {
      if (!cancelled) setPermissionsVersion((version) => version + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [isStreamer, channelId]);

  const hasPinPermission = useMemo(() => {
    if (!client || !channelId || !currentUserId) return false;
    const permission = client.hasPermission(Permissions.PinMessagePermission);
    return permission.currentUser() || permission.channel(channelId) || false;
    // `channel`, `membership` and `permissionsVersion` are refresh triggers only
    // (see UseCanPinMessageParams and the demotion effect above).
  }, [client, channelId, currentUserId, channel, membership, permissionsVersion]);

  return computeCanPinMessage({
    isHost,
    isCoHost,
    hasPinPermission,
    roomStatus: room?.status,
  });
};
