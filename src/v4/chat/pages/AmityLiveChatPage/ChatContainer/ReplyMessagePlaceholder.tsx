import React from 'react';
import useUser from '~/core/hooks/useUser';
import styles from './styles.module.css';
import UserAvatar from '~/v4/chat/components/UserAvatar';
import { SIZE_ALIAS } from '~/core/hocs/withSize';
import { FormattedMessage } from 'react-intl';
import { CloseIcon } from '~/icons';
import { backgroundImage as userBackgroundImage } from '~/icons/User';

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
        <UserAvatar
          avatarUrl={profile.avatar?.fileUrl}
          size={SIZE_ALIAS.SMALL}
          defaultImage={userBackgroundImage}
        />
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
