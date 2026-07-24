import { useEffect, useRef, useState } from 'react';
import { ChannelRepository, RoomRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';
import { MemberRoles } from '~/v4/chat/constants';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';

type AddRoleParams = Parameters<typeof ChannelRepository.Moderation.addRole>;

/**
 * Keeps the live chat's `channel-moderator` role in sync with the current
 * co-hosts of a livestream, but only when the current user is the host.
 *
 * Grant: mirrors iOS UIKit — the host's app assigns the role when a co-host
 * joins. Without it the co-host's moderation calls return 403 (PDT-3908).
 * Revoke: when a co-host leaves the stream (voluntary leave or host kick), the
 * host's app revokes the role AND drops the user from the channel's
 * `moderators` metadata array. Without this, historical messages from the
 * departed co-host keep rendering a Moderator badge on the co-host's own
 * rejoin view and on other viewers, since the MessageBubble badge check is
 * keyed on `channel.metadata.moderators` (PDT-3981).
 *
 * The metadata read uses a live/reactive channel via `useChannel` — the
 * `channel` prop from `useCreateLivestream` is a plain `useState` snapshot
 * that misses subsequent metadata mutations (StreamerStage adds the co-host
 * to `moderators` after invite-approval), so filtering from it would
 * overwrite server state with a stale list.
 *
 * `addRole` / `removeRole` are idempotent server-side, so re-grants /
 * re-revokes are safe.
 */
export function useAssignCoHostModerator({
  room,
  channel,
}: {
  room?: Amity.Room | null;
  channel?: Amity.Channel | null;
}) {
  const { currentUserId } = useSDK();
  const assignedRef = useRef<Set<string>>(new Set());
  const pendingRef = useRef<Set<string>>(new Set());
  const [coHostIds, setCoHostIds] = useState<string[]>([]);
  // internalId → userId map. `onRoomParticipantLeft` / `onRoomParticipantRemoved`
  // carry only `actorInternalId`; we need the public userId to sync metadata.
  const internalToUserIdRef = useRef<Map<string, string>>(new Map());

  // Reactive channel — see doc comment for why we don't read metadata off the prop.
  const { channel: liveChannel } = useChannel({ channelId: channel?.channelId });
  // Keep the latest metadata in a ref so the leave-handler closure below
  // doesn't need to be re-subscribed on every metadata tick.
  const metadataRef = useRef<Amity.Channel['metadata']>();
  useEffect(() => {
    metadataRef.current = liveChannel?.metadata ?? channel?.metadata;
  }, [liveChannel?.metadata, channel?.metadata]);

  const { mutate: assignModerator } = useMutation({
    mutationFn: ({ channelId, userId }: { channelId: AddRoleParams[0]; userId: string }) =>
      ChannelRepository.Moderation.addRole(channelId, MemberRoles.CHANNEL_MODERATOR, [userId]),
  });

  const { mutate: revokeModerator } = useMutation({
    mutationFn: ({ channelId, userId }: { channelId: AddRoleParams[0]; userId: string }) =>
      ChannelRepository.Moderation.removeRole(channelId, MemberRoles.CHANNEL_MODERATOR, [userId]),
  });

  const channelId = channel?.channelId;
  const hostId = room?.participants.find((participant) => participant.type === 'host')?.userId;
  const isHost = !!currentUserId && currentUserId === hostId;
  const roomStatus = room?.status;

  const trackCoHost = (participant?: Amity.RoomParticipant | null) => {
    if (!participant?.userId) return;
    if (participant.userInternalId) {
      internalToUserIdRef.current.set(participant.userInternalId, participant.userId);
    }
    setCoHostIds((prev) =>
      prev.includes(participant.userId!) ? prev : [...prev, participant.userId!],
    );
  };

  // Seed from co-hosts already present on the room (e.g. joined before mount).
  useEffect(() => {
    if (!isHost) return;
    (room?.participants ?? [])
      .filter((participant) => participant.type === 'coHost')
      .forEach((participant) => trackCoHost(participant));
  }, [isHost, room]);

  // Subscribe to stage-join events so we catch co-hosts who accept the invite
  // after the stream is live (room.participants is not reactive for this).
  useEffect(() => {
    if (!isHost || roomStatus !== 'live') return;
    const unsubscribe = RoomRepository.onRoomParticipantStageJoined(({ room: eventRoom }) => {
      trackCoHost(getRoomParticipant(eventRoom, 'coHost'));
    });
    return () => unsubscribe();
  }, [isHost, roomStatus]);

  // Grant the moderator role once both the channel and the co-host(s) are known.
  useEffect(() => {
    if (!isHost || !channelId) return;

    coHostIds.forEach((userId) => {
      const key = `${channelId}:${userId}`;
      if (assignedRef.current.has(key) || pendingRef.current.has(key)) return;

      pendingRef.current.add(key);
      assignModerator(
        { channelId, userId },
        {
          onSuccess: () => {
            assignedRef.current.add(key);
            pendingRef.current.delete(key);
          },
          onError: () => {
            pendingRef.current.delete(key);
          },
        },
      );
    });
  }, [isHost, channelId, coHostIds, assignModerator]);

  // Revoke the moderator role AND drop the user from `channel.metadata.moderators`
  // when a co-host leaves the stream or is removed by the host. Metadata is read
  // from the ref (updated by useChannel) so we always overwrite fresh server
  // state, not a stale snapshot.
  useEffect(() => {
    if (!isHost || !channelId) return;

    const handleCoHostGone = ({ actorInternalId }: { actorInternalId?: string }) => {
      if (!actorInternalId) return;
      const userId = internalToUserIdRef.current.get(actorInternalId);
      if (!userId) return;

      internalToUserIdRef.current.delete(actorInternalId);
      setCoHostIds((prev) => prev.filter((id) => id !== userId));
      assignedRef.current.delete(`${channelId}:${userId}`);
      pendingRef.current.delete(`${channelId}:${userId}`);

      revokeModerator({ channelId, userId });

      const metadata = metadataRef.current;
      const nextModerators = (metadata?.moderators ?? []).filter((id: string) => id !== userId);
      const nextMutedMembers = metadata?.mutedMembers ?? [];
      ChannelRepository.updateChannel(channelId, {
        metadata: { ...metadata, moderators: nextModerators, mutedMembers: nextMutedMembers },
      });
    };

    const unsubscribers: Amity.Unsubscriber[] = [
      RoomRepository.onRoomParticipantLeft(handleCoHostGone),
      RoomRepository.onRoomParticipantRemoved(handleCoHostGone),
    ];
    return () => unsubscribers.forEach((fn) => fn());
  }, [isHost, channelId, revokeModerator]);
}
