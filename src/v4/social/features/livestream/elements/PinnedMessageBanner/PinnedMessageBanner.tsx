import React, { KeyboardEvent, SyntheticEvent, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useString } from '~/v4/core/localization';
import { COMPONENT_ID, ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import { usePinMessage } from '~/v4/chat/hooks/usePinMessage';
import { HostBadge } from '~/v4/social/elements/HostBadge';
import { CoHostBadge } from '~/v4/social/elements/CoHostBadge';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { BrandBadge } from '~/v4/social/elements';
import Muted from '~/v4/icons/Muted';
import CloseIcon from '~/v4/icons/Close';
import { PinStraightFilled } from '~/v4/icons/PinStraightFilled';
import styles from './PinnedMessageBanner.module.css';

export interface PinnedMessageBannerProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  /** Live-chat channel id (public). */
  channelId: Amity.Channel['channelId'];
  /** `channel.pinnedMessage` from the channel live object. `null` → renders nothing. */
  pinnedMessage?: Amity.PinnedMessage | null;
  /** `(isStreamer || hasPermission(PIN_MESSAGE)) && room.status == live`; gates the "X" only. */
  canPin: boolean;
  /** `room.status == live`. `false` → renders nothing even if a pin exists (REQ-004). */
  isLive: boolean;
  /** `room.creatorId` / host participant — drives the Host badge in the byline. */
  hostUserId?: string;
  /** Current co-host participant — drives the Co-host badge in the byline. */
  coHostUserId?: string;
  /** Channel `metadata.moderators` — drives the Moderator badge in the byline. */
  moderatorUserIds?: string[];
  /** Channel `metadata.mutedMembers` — drives the muted icon in the byline. */
  mutedUserIds?: string[];
  /**
   * Whether the current viewer may see muted indicators at all (the feed shows them
   * only to streamers / moderators / muted viewers — AmityLivestreamChatFeed REQ-061).
   */
  showMutedIndicator?: boolean;
  /** Fired after a tap toggles more / less. Not fired when the text fits one line. */
  onExpandedChanged?: (messageId: Amity.Message['messageId'], isExpanded: boolean) => void;
}

const getPinnedMessageText = (pinnedMessage: Amity.PinnedMessage): string | null => {
  if (pinnedMessage.dataType !== 'text') return null;
  const data = pinnedMessage.data as { text?: unknown } | null | undefined;
  return typeof data?.text === 'string' ? data.text : null;
};

const stopPropagation = (event: SyntheticEvent) => event.stopPropagation();

/**
 * PinnedMessageBannerElement v1 — the single pinned message of a livestream chat,
 * rendered above the feed for every viewer while the stream is live.
 *
 * - Pure projection of `channel.pinnedMessage` (snapshot semantics, last write wins).
 * - Every new pin renders collapsed; the whole bubble toggles more / less
 *   ("more" / "less" are passive labels, not buttons). Collapse state is keyed to
 *   `pinnedMessage.messageId`, so a replacing pin resets it without a remount.
 * - "X" (unpin) is the only separate tap target and is rendered only when `canPin`.
 * - Overflow is measured from layout (single-line probe), not from character counts.
 */
export function PinnedMessageBanner({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.LIVESTREAM_CHAT_FEED,
  className,
  channelId,
  pinnedMessage,
  canPin,
  isLive,
  hostUserId,
  coHostUserId,
  moderatorUserIds,
  mutedUserIds,
  showMutedIndicator = true,
  onExpandedChanged,
}: PinnedMessageBannerProps) {
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId: ELEMENT_ID.PINNED_MESSAGE_BANNER,
  });
  const unpinButton = useAmityElement({
    pageId,
    componentId,
    elementId: ELEMENT_ID.UNPIN_MESSAGE_BUTTON,
  });

  const pinnedLabel = useString('amity_livechat_pinned_message_badge');
  const moreLabel = useString('amity_livechat_pinned_message_more');
  const lessLabel = useString('amity_livechat_pinned_message_less');

  const { unpinMessage, isUnpinning } = usePinMessage();

  const messageId = pinnedMessage?.messageId;
  const authorId = pinnedMessage?.creatorPublicId;
  const text = pinnedMessage ? getPinnedMessageText(pinnedMessage) : null;
  const isVisible = !!pinnedMessage && isLive && text !== null && !isExcluded;

  // Author comes from the `users[]` ingested with the pin payload; `useUser` reads the
  // SDK cache first and only fetches when the author is not cached (REQ-009).
  const { user: author } = useUser({ userId: authorId, shouldCall: !!authorId && isVisible });

  const pinKey = pinnedMessage ? `${pinnedMessage.messageId}|${pinnedMessage.pinnedAt}` : null;
  const [expandedPinKey, setExpandedPinKey] = useState<string | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Single-line overflow probe (REQ-025): re-measured on text change and on resize.
  useLayoutEffect(() => {
    const probe = measureRef.current;
    if (!probe || !isVisible) return;

    const measure = () => setIsOverflowing(probe.scrollWidth > probe.clientWidth);
    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(probe);
    return () => observer.disconnect();
  }, [isVisible, text, messageId]);

  if (!isVisible || !messageId) return null;

  const isExpanded = isOverflowing && expandedPinKey === pinKey;

  const toggleExpanded = () => {
    if (!isOverflowing) return;
    const next = !isExpanded;
    setExpandedPinKey(next ? pinKey : null);
    onExpandedChanged?.(messageId, next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const isHostAuthor = !!authorId && authorId === hostUserId;
  const isCoHostAuthor = !!authorId && !isHostAuthor && authorId === coHostUserId;
  const isModeratorAuthor =
    !!authorId && !isHostAuthor && !isCoHostAuthor && !!moderatorUserIds?.includes(authorId);
  const isMutedAuthor =
    showMutedIndicator &&
    !!authorId &&
    !isHostAuthor &&
    !isCoHostAuthor &&
    !isModeratorAuthor &&
    !!mutedUserIds?.includes(authorId);

  const showUnpin = canPin && !unpinButton.isExcluded;

  return (
    <div
      className={clsx(styles.pinnedMessageBanner, className)}
      style={themeStyles}
      data-testid={accessibilityId}
      data-qa-anchor={accessibilityId}
      data-message-id={messageId}
      data-channel-id={channelId}
      data-overflowing={isOverflowing}
      data-expanded={isExpanded}
      role={isOverflowing ? 'button' : undefined}
      tabIndex={isOverflowing ? 0 : undefined}
      aria-expanded={isOverflowing ? isExpanded : undefined}
      onClick={toggleExpanded}
      onKeyDown={isOverflowing ? handleKeyDown : undefined}
    >
      <div className={styles.pinnedMessageBanner__header}>
        <div className={styles.pinnedMessageBanner__author}>
          <Typography.CaptionSmall
            as="span"
            className={styles.pinnedMessageBanner__displayName}
            data-muted={isMutedAuthor}
          >
            {author?.displayName ?? ''}
          </Typography.CaptionSmall>
          {author?.isBrand && <BrandBadge pageId={pageId} componentId={componentId} />}
          {isHostAuthor ? (
            <HostBadge pageId={pageId} componentId={componentId} />
          ) : isCoHostAuthor ? (
            <CoHostBadge pageId={pageId} componentId={componentId} />
          ) : isModeratorAuthor ? (
            <ModeratorBadge pageId={pageId} componentId={componentId} type="live" />
          ) : null}
          {isMutedAuthor && <Muted className={styles.pinnedMessageBanner__mutedIcon} />}
        </div>
        <div className={styles.pinnedMessageBanner__badge}>
          <PinStraightFilled className={styles.pinnedMessageBanner__badgeIcon} />
          <Typography.CaptionSmall as="span" className={styles.pinnedMessageBanner__badgeText}>
            {pinnedLabel}
          </Typography.CaptionSmall>
        </div>
        {showUnpin && (
          // The "X" is the only separate tap target inside the bubble; its click must
          // not reach the bubble's more / less toggle (REQ-012).
          <div
            className={styles.pinnedMessageBanner__unpin}
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          >
            <Button
              type="button"
              variant="default"
              className={styles.pinnedMessageBanner__unpinButton}
              aria-label={unpinButton.resolveText('amity_livechat_pinned_message_unpin_button')}
              data-testid={unpinButton.accessibilityId}
              data-qa-anchor={unpinButton.accessibilityId}
              isDisabled={isUnpinning}
              onPress={() => unpinMessage(messageId)}
            >
              <CloseIcon className={styles.pinnedMessageBanner__unpinIcon} />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.pinnedMessageBanner__body}>
        <Typography.Caption as="span" className={styles.pinnedMessageBanner__text}>
          {text}
        </Typography.Caption>
        {isOverflowing && (
          <Typography.Caption as="span" className={styles.pinnedMessageBanner__indicator}>
            {isExpanded ? lessLabel : moreLabel}
          </Typography.Caption>
        )}
        {/* Hidden single-line probe used to decide whether the text fits one line. */}
        <span ref={measureRef} aria-hidden="true" className={styles.pinnedMessageBanner__measure}>
          <Typography.Caption as="span" className={styles.pinnedMessageBanner__measureText}>
            {text}
          </Typography.Caption>
        </span>
      </div>
    </div>
  );
}
