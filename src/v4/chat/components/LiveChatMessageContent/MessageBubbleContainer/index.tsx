import React from 'react';
import styles from './styles.module.css';
import UserAvatar from '../../UserAvatar';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import Badge from '~/v4/icons/Badge';
import { Typography } from '~/v4/core/components';
import { SIZE_ALIAS } from '~/core/hooks/useSize';

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
      <UserAvatar
        size={SIZE_ALIAS.SMALL}
        avatarUrl={avatarUrl}
        defaultImage={userBackgroundImage}
      />

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
