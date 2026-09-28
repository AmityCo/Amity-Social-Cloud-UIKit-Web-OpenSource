import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

/** Server error codes relevant to pin / unpin (Amity.ServerError). */
const SERVER_ERROR = {
  BAD_REQUEST: 400000,
  PERMISSION_DENIED: 400301,
  ITEM_NOT_FOUND: 400400,
} as const;

const getErrorCode = (error: unknown): number | undefined => {
  const code = (error as { code?: unknown } | null | undefined)?.code;
  return typeof code === 'number' ? code : undefined;
};

/**
 * Re-read a message so a pin target that was deleted concurrently (400 "message is
 * deleted" / 404) renders the "This message was deleted." placeholder even when the
 * `message.deleted` realtime event was missed (AmityLivestreamChatFeed v2 REQ-088).
 * Fire-and-forget; errors are swallowed.
 */
const syncMessageFromServer = (messageId: Amity.Message['messageId']) => {
  let settled = false;
  let unsubscribe: Amity.Unsubscriber | undefined;
  try {
    unsubscribe = MessageRepository.getMessage(messageId, ({ loading }) => {
      if (loading) return;
      settled = true;
      unsubscribe?.();
    });
    if (settled) unsubscribe();
  } catch {
    /* silent per spec */
  }
};

/**
 * Pin / unpin a livestream chat message (Implementation Plan 39, Phase 2).
 *
 * Pin state is server-owned: both calls return the channel envelope, which the SDK
 * ingests into the channel cache so `ChannelRepository.getChannel` observers (and the
 * pinned message banner) update without waiting for the realtime event.
 *
 * Error handling is intentionally silent — no toast, no dialog (Product decision
 * 2026-09-03; REQ-085 … REQ-088):
 * - 403: the SDK refreshes the current user's channel permissions; `useCanPinMessage`
 *   recomputes on the next channel emission and hides the controls.
 * - 400 / 404 on pin (target deleted): re-read the message so the deleted placeholder
 *   renders even if `message.deleted` was missed.
 * - Anything else (network, already pinned, not the current pin, banned author): the
 *   UI stays as it was and keeps following the channel live object.
 */
export const usePinMessage = () => {
  const { mutateAsync: pin, isPending: isPinning } = useMutation<
    Amity.Channel,
    Error,
    Amity.Message['messageId']
  >({
    mutationFn: (messageId) => MessageRepository.pinMessage(messageId),
  });

  const { mutateAsync: unpin, isPending: isUnpinning } = useMutation<
    Amity.Channel,
    Error,
    Amity.Message['messageId']
  >({
    mutationFn: (messageId) => MessageRepository.unpinMessage(messageId),
  });

  const pinMessage = useCallback(
    async (messageId: Amity.Message['messageId']): Promise<boolean> => {
      try {
        await pin(messageId);
        return true;
      } catch (error) {
        const code = getErrorCode(error);
        if (code === SERVER_ERROR.BAD_REQUEST || code === SERVER_ERROR.ITEM_NOT_FOUND) {
          syncMessageFromServer(messageId);
        }
        return false;
      }
    },
    [pin],
  );

  const unpinMessage = useCallback(
    async (messageId: Amity.Message['messageId']): Promise<boolean> => {
      try {
        await unpin(messageId);
        return true;
      } catch {
        // 400 "not the current pin" / 403 / network: the live object already carries
        // the authoritative state; nothing to show (REQ-086, REQ-087).
        return false;
      }
    },
    [unpin],
  );

  return { pinMessage, unpinMessage, isPinning, isUnpinning };
};
