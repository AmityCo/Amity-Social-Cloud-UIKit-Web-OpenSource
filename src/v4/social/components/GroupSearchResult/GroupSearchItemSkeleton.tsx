import React from 'react';
import clsx from 'clsx';
import styles from './GroupSearchItemSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface GroupSearchItemSkeletonProps {
  pageId?: string;
  componentId?: string;
}

export const GroupSearchItemSkeleton = ({
  pageId = '*',
  componentId = '*',
}: GroupSearchItemSkeletonProps) => {
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    <div
      data-testid={accessibilityId}
      className={clsx(styles.groupSearchItemSkeleton, styles.groupSearchItemSkeleton__animation)}
    >
      <div className={styles.groupSearchItemSkeleton__leftPane}>
        <div
          className={clsx(
            styles.groupSearchItemSkeleton__groupAvatar,
            styles.groupSearchItemSkeleton__animation,
          )}
        />
      </div>
      <div className={styles.groupSearchItemSkeleton__rightPane}>
        <div
          className={clsx(
            styles.groupSearchItemSkeleton__groupName,
            styles.groupSearchItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.groupSearchItemSkeleton__description,
            styles.groupSearchItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
