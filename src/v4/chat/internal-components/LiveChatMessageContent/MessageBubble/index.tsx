import React from 'react';
import styles from './styles.module.css';
import useUser from '~/v4/core/hooks/objects/useUser';
import { useMessageObject } from '~/v4/chat/hooks/objects/useMessageObject';
import MessageTextWithMention from '~/v4/chat/internal-components/LiveChatMessageContent/MessageTextWithMention';
import { Typography } from '~/v4/core/components';
import useSDK from '~/v4/core/hooks/useSDK';

interface MessageBubbleProps {
  message: Amity.Message<'text'>;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { currentUserId: userId } = useSDK();
  const isMentionToMe = message.metadata?.mentioned?.some(
    (mention: { index: number; userId: string; type: 'user' | 'channel'; length: number }) =>
      mention.userId === userId || mention.type === 'channel',
  );

  const { message: parentMessage } = useMessageObject({ messageId: message.parentId ?? null });
  const parentUser = useUser((parentMessage as Amity.Message<'text'> | undefined)?.creatorId);

  if (message && message.parentId) {
    const typedParentMessage = parentMessage as Amity.Message<'text'> | undefined;
    if (!typedParentMessage || !parentUser) return null;

    return (
      <div className={styles.messageRepliedBubble}>
        <div className={styles.messageParentContainer}>
          <div className={styles.messageParentDisplayName}>
            <Typography.BodyBold>{parentUser.displayName}</Typography.BodyBold>
          </div>
          <Typography.Body className={styles.messageParentText}>
            {typedParentMessage.data?.text}
          </Typography.Body>
        </div>
        <div className={styles.messageChildContainer}>
          <MessageTextWithMention className={styles.messageChildText} message={message} />
        </div>
      </div>
    );
  }

  return (
    <div data-mentioned={isMentionToMe} className={styles.messageBubble}>
      <MessageTextWithMention message={message} />
    </div>
  );
};

export default MessageBubble;
