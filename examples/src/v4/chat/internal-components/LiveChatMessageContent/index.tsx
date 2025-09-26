import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Typography } from '~/v4/core/components';
import { MessageAction, MessageActionType } from './MessageAction';
import MessageBubbleContainer from './MessageBubbleContainer';
import Bin from '~/v4/icons/Bin';
import useSDK from '~/core/hooks/useSDK';
import MessageBubble from './MessageBubble';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import Flag from '~/v4/icons/Flag';
import { MessageReaction } from './MessageReaction';
import { MessageReactionPreview } from '~/v4/chat/components/MessageReactionPreview';
import Sheet from 'react-modal-sheet';
import { ReactionList } from '~/v4/social/components';
import styles from './styles.module.css';

interface MessageItemProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  message: Amity.Message<'text'>;
  userDisplayName?: string;
  avatarUrl?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  action?: MessageActionType;
}

const LiveChatMessageContent = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  message,
  avatarUrl,
  userDisplayName,
  containerRef,
  action,
}: MessageItemProps) => {
  const sdk = useSDK();
  const isOwner = message.creatorId === sdk.currentUserId;
  const { isModerator } = useChannelPermission(message.channelId);
  const [openReactionPanel, setOpenReactionPanel] = useState<Amity.Message | undefined>(undefined);

  return (
    <>
      <MessageBubbleContainer avatarUrl={avatarUrl} displayName={userDisplayName}>
        <div className={styles.messageItemContainerInner} data-reactions={!!message.reactionsCount}>
          {message.isDeleted ? (
            <div className={styles.messageDeletedBubble}>
              <Bin className={styles.binIcon} />
              <div>
                <Typography.Body>This message was deleted</Typography.Body>
              </div>
            </div>
          ) : (
            <div className={styles.messageBubbleWrap}>
              <MessageBubble message={message} />
              <div className={styles.messageReaction}>
                <MessageReactionPreview
                  message={message}
                  onClick={() => setOpenReactionPanel(message)}
                />
              </div>
              {action && (
                <MessageAction
                  containerRef={containerRef}
                  isOwner={isOwner}
                  isModerator={isModerator}
                  action={action}
                  isFlagged={message.flagCount > 0}
                />
              )}
              <MessageReaction
                message={message}
                containerRef={containerRef}
                pageId={pageId}
                componentId={componentId}
              />
              {message.flagCount > 0 && <Flag className={styles.flagIcon} />}
              <div className={styles.timestamp}>{dayjs(message.createdAt).format('HH:mm A')}</div>
            </div>
          )}
        </div>
      </MessageBubbleContainer>

      {openReactionPanel && (
        <Sheet
          isOpen={true}
          onClose={() => setOpenReactionPanel(undefined)}
          className={styles.reactionListSheet}
        >
          <Sheet.Container className={styles.reactionListContainer}>
            <Sheet.Header />
            <Sheet.Content>
              <ReactionList
                pageId={pageId}
                referenceId={openReactionPanel.messageId}
                referenceType={'message'}
              />
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop className={styles.reactionListBackdrop} />
        </Sheet>
      )}
    </>
  );
};

export default LiveChatMessageContent;
