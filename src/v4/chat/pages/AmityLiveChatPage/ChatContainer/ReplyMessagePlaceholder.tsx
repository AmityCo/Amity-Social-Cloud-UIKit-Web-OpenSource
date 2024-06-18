import React from 'react';
import useUser from '~/core/hooks/useUser';
import styles from './styles.module.css';
import { FormattedMessage } from 'react-intl';
import CloseIcon from '~/v4/icons/Close';
import { Avatar } from '~/v4/core/components';
import User from '~/v4/icons/User';
import { AVATAR_SIZE } from '~/v4/core/components/Avatar/Avatar';

interface ReplyMessagePlaceholderProps {
  replyMessage: Amity.Message<'text'>;
  onDismiss: () => void;
}

const ReplyMessagePlaceholder = ({ replyMessage, onDismiss }: ReplyMessagePlaceholderProps) => {
  const profile = useUser(replyMessage.creatorId);

  if (!profile) return null;

  return (
    <div className={styles.replyPlaceholderContainer}>
      <div className={styles.replyAvatar}>
        <Avatar avatar={profile.avatar?.fileUrl} size={AVATAR_SIZE.SMALL} defaultImage={<User />} />
      </div>
      <div className={styles.replyProfile}>
        <div className={styles.replyProfileName}>
          <FormattedMessage
            id="CommentComposeBar.replayToUser"
            values={{ displayName: profile.displayName }}
          />
        </div>
        <div className={styles.replyProfileMessage}>{replyMessage.data?.text}</div>
      </div>
      <div className={styles.replyDismiss}>
        <CloseIcon onClick={onDismiss} width="20" height="20" />
      </div>
    </div>
  );
};

export default ReplyMessagePlaceholder;
