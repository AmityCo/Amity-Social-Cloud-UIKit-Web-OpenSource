import type { ReactNode } from 'react';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { useString } from '~/v4/core/localization';
import { Failed } from '~/v4/icons/Failed';
import { formatMessageTime } from '~/v4/chat/utils/formatMessageTime';
import { MessageReplyQuote } from '~/v4/chat/features/shared/components/MessageReplyQuote';
import { MessageReactionBadge } from '~/v4/chat/features/shared/components/MessageReactionBadge';
import styles from './MessageRow.module.css';
import { Avatar } from '~/v4/chat/elements';

type MessageRowProps = {
  message: Amity.Message;
  isUser: boolean;
  bubble: ReactNode;
  onOpenFailedSheet: (message: Amity.Message) => void;
  onOpenSeeMore: (text: string, title?: string) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
  onOpenReactorList: (message: Amity.Message) => void;
  isBubbleMenuOpen?: boolean;
  isGroupChat?: boolean;
  isModerator?: boolean;
};

export function MessageRow({
  message,
  isUser,
  bubble,
  onOpenFailedSheet,
  onOpenSeeMore,
  onOpenImage,
  onOpenVideo,
  onOpenReactorList,
  isBubbleMenuOpen = false,
  isGroupChat = false,
  isModerator = false,
}: MessageRowProps) {
  const sendingLabel = useString('amity_chat_sending_status');
  const syncState = message.syncState;
  const isFailed = syncState === ('error' as Amity.SyncState);
  const isSynced = syncState === ('synced' as Amity.SyncState);
  const isDeleted = !!message.isDeleted;
  const createdAt = message.createdAt ? new Date(message.createdAt) : null;
  const showSenderName = !isUser && isGroupChat && !message.parentId;
  const senderName = message.creator?.displayName ?? '';
  const hasReaction = !!message.reactionsCount && message.reactionsCount > 0 && !isDeleted;

  const ownTimestamp =
    isUser && isSynced && createdAt && !isDeleted ? (
      <Typography.CaptionSmall className={styles.messageRow__side}>
        {formatMessageTime(createdAt)}
      </Typography.CaptionSmall>
    ) : null;
  const ownSending =
    isUser && !isSynced && !isFailed ? (
      <Typography.CaptionSmall className={styles.messageRow__side}>
        {sendingLabel}
      </Typography.CaptionSmall>
    ) : null;
  const otherTimestamp =
    !isUser && createdAt && !isDeleted ? (
      <Typography.CaptionSmall className={styles.messageRow__side}>
        {formatMessageTime(createdAt)}
      </Typography.CaptionSmall>
    ) : null;

  return (
    <div
      className={styles.messageRow}
      data-user={isUser ? 'own' : 'other'}
      data-has-reaction={hasReaction ? 'true' : 'false'}
    >
      {!isUser && message.creator ? (
        <div className={styles.messageRow__avatar}>
          <Avatar.User user={message.creator} isModerator={isModerator} size="sm" />
        </div>
      ) : null}

      <div className={styles.messageRow__content}>
        {showSenderName ? (
          <Typography.CaptionBold className={styles.messageRow__senderName}>
            {senderName}
          </Typography.CaptionBold>
        ) : null}
        {message.parentId && !isDeleted ? (
          <MessageReplyQuote
            parentId={message.parentId}
            child={message}
            isUser={isUser}
            isGroupChat={isGroupChat}
            onOpenSeeMore={isBubbleMenuOpen ? () => {} : onOpenSeeMore}
            onOpenImage={isBubbleMenuOpen ? () => {} : onOpenImage}
            onOpenVideo={isBubbleMenuOpen ? () => {} : onOpenVideo}
          />
        ) : null}
        <div className={styles.messageRow__bubble}>
          <div className={styles.messageRow__bubbleRow}>
            {ownTimestamp}
            {ownSending}
            {isUser && isFailed ? (
              <Button
                type="button"
                variant="text"
                className={styles.messageRow__errorButton}
                onPress={() => onOpenFailedSheet(message)}
                aria-label="Message failed to send"
              >
                <Failed className={styles.messageRow__errorIcon} />
              </Button>
            ) : null}
            {bubble}
            {otherTimestamp}
          </div>
          <div className={styles.messageRow__reactionBadge}>
            <MessageReactionBadge message={message} onTap={() => onOpenReactorList(message)} />
          </div>
        </div>
      </div>
    </div>
  );
}
