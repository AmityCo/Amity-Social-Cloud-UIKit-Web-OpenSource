import React from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import styles from './StoryTabDisplayName.module.css';

interface StoryTabDisplayNameProps {
  pageId: string;
  componentId: string;
  displayName?: string;
  isPublic?: boolean;
}

export const StoryTabDisplayName: React.FC<StoryTabDisplayNameProps> = ({
  pageId,
  componentId,
  displayName,
  isPublic,
}) => {
  return (
    <div className={styles.storyTabDisplayName__container}>
      {!isPublic && <CommunityPrivateBadge className={styles.storyTabDisplayName__lockIcon} />}
      <Typography.Caption
        data-testid={`${pageId}/${componentId}/community_name`}
        className={clsx(styles.storyTabDisplayName)}
      >
        {displayName}
      </Typography.Caption>
    </div>
  );
};
