import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChannelRepository, RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { resolveString } from '~/v4/core/localization';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { MemberRoles } from '~/v4/chat/constants';

export interface UseRemoveParticipantProps {
  room?: Amity.Room | null;
  pageId?: string;
}

export interface UseRemoveParticipantReturn {
  removeParticipant: (userId: string) => void;
  handleRemoveParticipant: (userId: string) => void;
  isPending: boolean;
}

export const useRemoveParticipant = ({
  room,
  pageId = '*',
}: UseRemoveParticipantProps): UseRemoveParticipantReturn => {
  const { confirm } = useConfirmContext();
  const { success, error } = useNotifications();
  const { notificationAlignment, channel } = useLivestreamData();
  // Live channel for fresh `metadata` — the provider's `channel` is a snapshot that can
  // miss later metadata writes (e.g. the co-host being appended to `moderators`).
  const { channel: liveChannel } = useChannel({ channelId: channel?.channelId });
  const liveChannelRef = useRef(liveChannel);
  useEffect(() => {
    liveChannelRef.current = liveChannel;
  }, [liveChannel]);

  /**
   * `ChannelRepository.updateChannel` writes the new metadata into the SDK cache but does
   * not notify channel live objects, so on the host's own device the chat keeps the old
   * `moderators` list until the realtime `channel.updated` event lands. That event races
   * the room's participant-removed event; when the room event wins, the demoted user's
   * bubbles fall through to the ModeratorBadge for a moment. Wait until our live channel
   * reflects the cleanup before removing the participant, so the room event can never
   * arrive first. Bounded by a timeout so a missed event cannot block the demotion.
   */
  const waitUntilModeratorCleared = (userId: string, timeoutMs = 3000) =>
    new Promise<void>((resolve) => {
      const startedAt = Date.now();
      const tick = () => {
        const moderators: string[] = liveChannelRef.current?.metadata?.moderators ?? [];
        if (!moderators.includes(userId) || Date.now() - startedAt >= timeoutMs) {
          resolve();
          return;
        }
        setTimeout(tick, 100);
      };
      tick();
    });

  /**
   * Drop the co-host's moderator footprint on the live chat *before* removing them from
   * the room. The CoHostBadge follows the room's participants and disappears as soon as
   * the room event lands; the ModeratorBadge follows `channel.metadata.moderators`. If
   * the metadata is cleaned only in reaction to that same event (useAssignCoHostModerator),
   * every client falls through to the ModeratorBadge for one round trip — a visible blink.
   * Cleaning first means the room event arrives with the metadata already clean.
   * Best-effort: a failure here must not block the demotion; the event-driven cleanup
   * remains as the fallback.
   */
  const clearCoHostModerator = async (userId: string) => {
    const channelId = liveChannel?.channelId ?? channel?.channelId;
    if (!channelId) return;
    const metadata = liveChannel?.metadata ?? channel?.metadata;
    const moderators: string[] = metadata?.moderators ?? [];

    if (moderators.includes(userId)) {
      try {
        await ChannelRepository.updateChannel(channelId, {
          metadata: { ...metadata, moderators: moderators.filter((id) => id !== userId) },
        });
        await waitUntilModeratorCleared(userId);
      } catch {
        /* best-effort */
      }
    }
    try {
      await ChannelRepository.Moderation.removeRole(channelId, MemberRoles.CHANNEL_MODERATOR, [
        userId,
      ]);
    } catch {
      /* best-effort — may already be revoked */
    }
  };

  const { mutate: removeParticipant, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      await clearCoHostModerator(userId);
      return RoomRepository.removeParticipant(room?.roomId || '', userId);
    },
    onSuccess: () =>
      success({
        content: resolveString('amity_social_status_cohost_removed'),
        alignment: notificationAlignment,
      }),
    onError: () =>
      error({
        content: resolveString('amity_social_toast_remove_co_host_failed_toast'),
        alignment: notificationAlignment,
      }),
  });

  const handleRemoveParticipant = (userId: string) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => removeParticipant(userId),
      okText: resolveString('amity_social_modal_alert_remove_button'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_remove_co_host_from_live'),
      pageId,
      content: resolveString('amity_social_modal_alert_remove_cohost_message'),
    });
  };

  return {
    removeParticipant,
    handleRemoveParticipant,
    isPending,
  };
};
