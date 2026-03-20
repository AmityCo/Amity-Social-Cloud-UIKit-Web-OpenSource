import React from 'react';
import { Typography } from '~/v4/core/components';
import { BrandBadge } from '~/v4/social/elements/BrandBadge';
import { CoHostBadge } from '~/v4/social/elements/CoHostBadge';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import Muted from '~/v4/icons/Muted';
import styles from './UserModerationHeader.module.css';

export interface UserModerationHeaderProps {
  pageId?: string;
  componentId?: string;
  displayName?: string;
  isBrandUser?: boolean;
  isMuted?: boolean;
  isCoHost?: boolean;
  isModerator?: boolean;
  showMutedIcon?: boolean;
}

export const UserModerationHeader: React.FC<UserModerationHeaderProps> = ({
  pageId = '*',
  componentId = '*',
  displayName,
  isBrandUser,
  isMuted,
  isCoHost,
  isModerator,
  showMutedIcon = true,
}) => {
  return (
    <div className={styles.userModerationHeader}>
      <div className={styles.userModerationHeader__displayName__container}>
        <Typography.TitleBold className={styles.userModerationHeader__displayName}>
          {displayName}
        </Typography.TitleBold>
        {isBrandUser && <BrandBadge pageId={pageId} componentId={componentId} />}
        {isMuted && showMutedIcon && (
          <div className={styles.userModerationHeader__mutedIcon}>
            <Muted className={styles.userModerationHeader__mutedIcon} />
          </div>
        )}
      </div>
      {isCoHost ? (
        <CoHostBadge pageId={pageId} componentId={componentId} />
      ) : (
        isModerator && <ModeratorBadge pageId={pageId} componentId={componentId} type="live" />
      )}
    </div>
  );
};
