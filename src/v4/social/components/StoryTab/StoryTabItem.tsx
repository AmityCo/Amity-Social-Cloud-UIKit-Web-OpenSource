import clsx from 'clsx';
import React from 'react';
import Verified from '~/v4/icons/Verified';
import { StoryRing } from '~/v4/social/elements/StoryRing';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { StoryTabDisplayName } from './StoryTabDisplayName';
import styles from './StoryTabItem.module.css';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { ErrorBadge } from '~/v4/icons/ErrorBadge';

interface StoryTabProps {
  pageId: string;
  componentId: string;
  targetId: string;
  hasUnseen: boolean;
  onClick: () => void;
  size: number;
  isErrored?: boolean;
}

export const StoryTabItem: React.FC<StoryTabProps> = ({
  pageId,
  componentId,
  targetId,
  hasUnseen,
  onClick,
  isErrored,
}) => {
  const { community } = useCommunity({
    communityId: targetId,
  });

  return (
    <div className={clsx(styles.container)} onClick={onClick} tabIndex={0} role="button">
      <div className={styles.avatarContainer}>
        <StoryRing
          pageId={pageId}
          componentId={componentId}
          hasUnseen={hasUnseen}
          isErrored={isErrored}
        />
        <CommunityAvatar
          pageId={pageId}
          componentId={componentId}
          community={community}
          className={styles.avatar}
        />
        {isErrored && <ErrorBadge className={styles.errorIcon} />}
        {community?.isOfficial && !isErrored && <Verified className={styles.verifiedIcon} />}
      </div>

      <StoryTabDisplayName
        pageId={pageId}
        componentId={componentId}
        displayName={community?.displayName}
        isPublic={community?.isPublic}
      />
    </div>
  );
};
