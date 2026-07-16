import { useEffect, useMemo, useRef } from 'react';
import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';
import { MemberRoles } from '~/v4/chat/constants';

type AddRoleParams = Parameters<typeof ChannelRepository.Moderation.addRole>;

/**
 * Grants the `channel-moderator` role on the live chat channel to every co-host
 * who joins, but only when the current user is the livestream host.
 *
 * Mirrors the iOS UIKit: the host's app assigns the role when a co-host joins.
 * Without it the co-host's moderation calls (promote, demote, mute, delete
 * message) return 403. See PDT-3908.
 *
 * The grant is reactive and success-tracked rather than a one-shot on the
 * stage-joined event, so it self-heals the timing race where the channel (for
 * events) arrives after the co-host joins, and survives remount/reconnect.
 * `addRole` is idempotent server-side, so re-grants are harmless.
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

  const { mutate: assignModerator } = useMutation({
    mutationFn: ({ channelId, userId }: { channelId: AddRoleParams[0]; userId: string }) =>
      ChannelRepository.Moderation.addRole(channelId, MemberRoles.CHANNEL_MODERATOR, [userId]),
  });

  const channelId = channel?.channelId;
  const hostId = room?.participants.find((participant) => participant.type === 'host')?.userId;
  const isHost = !!currentUserId && currentUserId === hostId;

  const coHostIds = useMemo(
    () =>
      (room?.participants ?? [])
        .filter((participant) => participant.type === 'coHost')
        .map((participant) => participant.userId),
    [room],
  );
  const coHostIdsKey = coHostIds.join(',');

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
  }, [isHost, channelId, coHostIdsKey]);
}
