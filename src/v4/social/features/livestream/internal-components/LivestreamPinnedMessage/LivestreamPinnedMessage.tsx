import React, { useEffect, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import { useCanPinMessage } from '~/v4/chat/hooks/useCanPinMessage';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { PinnedMessageBanner } from '~/v4/social/features/livestream/elements/PinnedMessageBanner';

export interface LivestreamPinnedMessageProps {
  pageId?: string;
  /** Defaults to `livestream_chat_feed` — the component id the pin-message config keys use. */
  componentId?: string;
  className?: string;
}

/**
 * Wires `PinnedMessageBannerElement` into the livestream chat (AmityLivestreamChatFeed v2
 * REQ-089 / REQ-090). Composed at the top of the chat column in both the viewer player
 * page and the streamer view.
 *
 * Reads pin state from the channel live object (`channel.pinnedMessage`) — no extra MQTT
 * subscription; `channel.messagePinned` / `channel.messageUnpinned` arrive on the channel
 * topic the feed already subscribes to. Role / mute signals come from the same room and
 * channel `metadata` the message bubbles use, so the byline stays in sync with the feed.
 */
export const LivestreamPinnedMessage: React.FC<LivestreamPinnedMessageProps> = ({
  pageId,
  componentId = COMPONENT_ID.LIVESTREAM_CHAT_FEED,
  className,
}) => {
  const { currentUserId } = useSDK();
  const { channel, room, hostId, coHostId } = useLivestreamData();
  const channelId = channel?.channelId;

  const { channel: liveChannel } = useChannel({ channelId });

  // The live channel doubles as the refresh trigger for the permission arm of canPin:
  // the SDK re-reads the channel (and the caller's channel permissions) after a 403.
  const canPin = useCanPinMessage({ channelId, channel: liveChannel });

  const { isModerator: isChannelModerator } = useChannelPermission(channelId);
  const moderatorUserIds: string[] | undefined = liveChannel?.metadata?.moderators;
  const mutedUserIds: string[] | undefined = liveChannel?.metadata?.mutedMembers;
  const isCurrentUserModerator =
    isChannelModerator || !!(currentUserId && moderatorUserIds?.includes(currentUserId));
  const isCurrentUserMuted = !!(currentUserId && mutedUserIds?.includes(currentUserId));

  // A channel emission that lands right after sending a message (or any other
  // channel-scoped update) can briefly carry a stale `pinnedMessage` — the emitter
  // re-runs before the pin cache has settled, so the previous pin flashes back
  // before the current one re-renders. Latch onto the monotonic `pinnedAt` and
  // reject any incoming pin that is strictly older than the one already on screen.
  const incomingPinnedMessage = liveChannel?.pinnedMessage ?? null;
  const [pinnedMessage, setPinnedMessage] = useState<Amity.PinnedMessage | null>(null);

  useEffect(() => {
    setPinnedMessage((current) => {
      if (!incomingPinnedMessage) return null;
      if (!current) return incomingPinnedMessage;
      if (current.messageId === incomingPinnedMessage.messageId) return current;
      const currentAt = new Date(current.pinnedAt).getTime();
      const incomingAt = new Date(incomingPinnedMessage.pinnedAt).getTime();
      if (!Number.isNaN(currentAt) && !Number.isNaN(incomingAt) && incomingAt < currentAt) {
        return current;
      }
      return incomingPinnedMessage;
    });
  }, [incomingPinnedMessage]);

  if (!channelId) return null;

  return (
    <PinnedMessageBanner
      pageId={pageId}
      componentId={componentId}
      className={className}
      channelId={channelId}
      pinnedMessage={pinnedMessage}
      canPin={canPin}
      isLive={room?.status === liveStreamStatus.live}
      hostUserId={hostId}
      coHostUserId={coHostId}
      moderatorUserIds={moderatorUserIds}
      mutedUserIds={mutedUserIds}
      // Same visibility rule as the message bubbles (REQ-061): muted indicators are shown
      // to streamers / moderators and to viewers who are themselves muted.
      showMutedIndicator={isCurrentUserMuted || isCurrentUserModerator}
    />
  );
};
