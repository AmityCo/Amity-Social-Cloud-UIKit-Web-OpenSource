import { useEffect, useRef, useState } from 'react';
import { ChannelRepository, RoomRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';
import { MemberRoles } from '~/v4/chat/constants';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';

type AddRoleParams = Parameters<typeof ChannelRepository.Moderation.addRole>;

/**
 * Grants the `channel-moderator` role on the live chat channel to every co-host
 * who joins, but only when the current user is the livestream host.
 *
 * Mirrors the iOS UIKit: the host's app assigns the role when a co-host joins.
 * Without it the co-host's moderation calls (promote, demote, mute, delete
 * message) return 403. See PDT-3908.
 *
 * Co-hosts are collected from the `onRoomParticipantStageJoined` event (the same
 * source useCoHostParticipantEvents relies on) plus an initial seed from
 * `room.participants`, because the room live object does not reliably re-emit its
 * `participants` when a co-host joins the stage — so watching `room.participants`
 * alone never fired. The grant itself is a separate effect keyed on the channel,
 * so it self-heals the timing race where the channel (for events) arrives after
 * the co-host joins. `addRole` is idempotent server-side, so re-grants are safe.
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

  const { mutate: assignModerator } = useMutation({
    mutationFn: ({ channelId, userId }: { channelId: AddRoleParams[0]; userId: string }) =>
      ChannelRepository.Moderation.addRole(channelId, MemberRoles.CHANNEL_MODERATOR, [userId]),
  });

  const channelId = channel?.channelId;
  const hostId = room?.participants.find((participant) => participant.type === 'host')?.userId;
  const isHost = !!currentUserId && currentUserId === hostId;
  const roomStatus = room?.status;

  const addCoHostId = (userId?: string) => {
    if (!userId) return;
    setCoHostIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  };

  // Seed from co-hosts already present on the room (e.g. joined before mount).
  useEffect(() => {
    if (!isHost) return;
    (room?.participants ?? [])
      .filter((participant) => participant.type === 'coHost')
      .forEach((participant) => addCoHostId(participant.userId));
  }, [isHost, room]);

  // Subscribe to stage-join events so we catch co-hosts who accept the invite
  // after the stream is live (room.participants is not reactive for this).
  useEffect(() => {
    if (!isHost || roomStatus !== 'live') return;
    const unsubscribe = RoomRepository.onRoomParticipantStageJoined(({ room: eventRoom }) => {
      addCoHostId(getRoomParticipant(eventRoom, 'coHost')?.userId);
    });
    return () => unsubscribe();
  }, [isHost, roomStatus]);

  // Grant the moderator role once both the channel and the co-host(s) are known.
  // Re-runs when the channel resolves (events fetch it after the co-host joins).
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
}
