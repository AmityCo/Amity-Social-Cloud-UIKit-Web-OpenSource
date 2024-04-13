import React from 'react';
import styles from './styles.module.css';
import useUser from '~/core/hooks/useUser';
import useMessage from '~/chat/hooks/useMessage';
import MessageTextWithMention from '../MessageTextWithMention';
import { Typography } from '~/v4/core/components';

interface MessageBubbleProps {
  message: Amity.Message<'text'>;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  if (message && message.parentId) {
    const parentMessage = useMessage(message.parentId) as Amity.Message<'text'>;
    const parentUser = useUser(parentMessage?.creatorId);

    if (!parentMessage || !parentUser) return null;

    return (
      <div className={styles.messageRepliedBubble}>
        <div className={styles.messageParentContainer}>
          <div className={styles.messageParentDisplayName}>
            <Typography.BodyBold>{parentUser.displayName}</Typography.BodyBold>
          </div>
          <Typography.Body className={styles.messageParentText}>
            {parentMessage.data?.text}
          </Typography.Body>
        </div>
        <div className={styles.messageChildContainer}>
          <MessageTextWithMention className={styles.messageChildText} message={message} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageBubble}>
      <MessageTextWithMention message={message} />
    </div>
  );
};

export default MessageBubble;
