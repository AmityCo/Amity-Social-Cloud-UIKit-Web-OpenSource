import React from 'react';
import clsx from 'clsx';
import styles from './UserSearchItemSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface UserSearchItemSkeletonProps {
  pageId?: string;
  componentId?: string;
}

export const UserSearchItemSkeleton = ({
  pageId = '*',
  componentId = '*',
}: UserSearchItemSkeletonProps) => {
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    <div
      data-qa-anchor={accessibilityId}
      className={clsx(styles.userSearchItemSkeleton, styles.userSearchItemSkeleton__animation)}
    >
      <div className={styles.userSearchItemSkeleton__leftPane}>
        <div
          className={clsx(
            styles.userSearchItemSkeleton__userAvatar,
            styles.userSearchItemSkeleton__animation,
          )}
        />
      </div>
      <div
        className={clsx(
          styles.userSearchItemSkeleton__information,
          styles.userSearchItemSkeleton__animation,
        )}
      >
        <div
          className={clsx(
            styles.userSearchItemSkeleton__information__title,
            styles.userSearchItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.userSearchItemSkeleton__information__subtitle,
            styles.userSearchItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
