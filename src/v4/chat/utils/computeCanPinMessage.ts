import { liveStreamStatus } from '~/v4/social/constants/livestream';

export interface ComputeCanPinMessageParams {
  isHost: boolean;
  isCoHost: boolean;
  hasPinPermission: boolean;
  roomStatus?: string | null;
}

/**
 * Pin gate for the livestream chat (AmityLivestreamChatFeed v2 REQ-080):
 *
 *   canPin = (isStreamer || hasPermission(PIN_MESSAGE)) && room.status == live
 *   isStreamer = isHost || isCoHost
 *
 * `metadata.moderators` is intentionally NOT a signal — a real moderator holds a
 * channel role that already carries PIN_MESSAGE, and a metadata-only entry would
 * get a 403 from the server anyway (Implementation Plan 39, Open Question 1).
 */
export const computeCanPinMessage = ({
  isHost,
  isCoHost,
  hasPinPermission,
  roomStatus,
}: ComputeCanPinMessageParams): boolean => {
  const isStreamer = isHost || isCoHost;
  return (isStreamer || hasPinPermission) && roomStatus === liveStreamStatus.live;
};
