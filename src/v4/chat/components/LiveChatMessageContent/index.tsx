import React from 'react';
import styles from './styles.module.css';
import { Typography } from '~/v4/core/components';
import MessageAction, { AmityMessageActionType } from './MessageAction';
import MessageBubbleContainer from './MessageBubbleContainer';
import { FormattedTime, useIntl } from 'react-intl';
import Bin from '~/v4/icons/Bin';
import useSDK from '~/core/hooks/useSDK';
import MessageBubble from './MessageBubble';
import useChannelPermission from '../../hooks/useChannelPermission';

interface MessageItemProps {
  message: Amity.Message<'text'>;
  isCreator: boolean;
  userDisplayName?: string;
  avatarUrl?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  action: AmityMessageActionType;
}

const LiveChatMessageContent = ({
  message,
  avatarUrl,
  userDisplayName,
  containerRef,
  action,
}: MessageItemProps) => {
  const { formatMessage } = useIntl();
  const sdk = useSDK();
  const isOwner = message.creatorId === sdk.currentUserId;
  const { isModerator } = useChannelPermission(message.channelId);

  return (
    <MessageBubbleContainer avatarUrl={avatarUrl} displayName={userDisplayName}>
      <div>
        {message.isDeleted ? (
          <div className={styles.messageDeletedBubble}>
            <Bin className={styles.binIcon} />
            <div>
              <Typography.Body>
                {formatMessage({
                  id: 'livechat.deleted.message',
                })}
              </Typography.Body>
            </div>
          </div>
        ) : (
          <div className={styles.messageBubbleWrap}>
            <MessageBubble message={message} />
            <MessageAction
              containerRef={containerRef}
              isOwner={isOwner}
              isModerator={isModerator}
              action={action}
            />
            <div className={styles.timestamp}>
              <FormattedTime value={new Date(message.createdAt)} />
            </div>
          </div>
        )}
      </div>
    </MessageBubbleContainer>
  );
};

export default LiveChatMessageContent;
