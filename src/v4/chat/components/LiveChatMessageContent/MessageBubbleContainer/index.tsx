import React from 'react';
import styles from './styles.module.css';
import User from '~/v4/icons/User';
import { Typography } from '~/v4/core/components';
import { Avatar, AVATAR_SIZE } from '~/v4/core/components/Avatar';

interface MessageBubbleContainerProps {
  avatarUrl?: string;
  displayName?: string;
  children: React.ReactNode;
}

const MessageBubbleContainer = ({
  avatarUrl,
  displayName,
  children,
}: MessageBubbleContainerProps) => {
  return (
    <div className={styles.messageItemContainer}>
      <Avatar size={AVATAR_SIZE.SMALL} avatar={avatarUrl} defaultImage={<User />} />

      <div>
        <div className={styles.userDisplayName}>
          {/* TODO: release 1.1 hide moderator badge, will be implemented in release 1.2  */}
          {/* {isBadgeShow && <Badge className={styles.moderatorBadge} />} */}
          <Typography.CaptionBold>{displayName}</Typography.CaptionBold>
        </div>

        {children}
      </div>
    </div>
  );
};

export default MessageBubbleContainer;
