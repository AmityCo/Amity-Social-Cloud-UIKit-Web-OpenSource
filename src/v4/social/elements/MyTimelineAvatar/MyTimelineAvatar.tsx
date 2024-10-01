import React from 'react';
import styles from './MyTimelineAvatar.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface MyTimelineAvatarProps {
  pageId?: string;
  componentId?: string;
  userId?: string | null;
}

export function MyTimelineAvatar({
  pageId = '*',
  componentId = '*',
  userId,
}: MyTimelineAvatarProps) {
  const elementId = 'my_timeline_avatar';
  const { accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div className={styles.myTimelineAvatar} data-qa-anchor={accessibilityId}>
      <UserAvatar
        pageId={pageId}
        componentId={componentId}
        className={styles.myTimelineAvatar__userAvatar}
        userId={userId}
      />
    </div>
  );
}
