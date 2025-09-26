import React from 'react';
import clsx from 'clsx';
import styles from './TagSearchItemSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface TagSearchItemSkeletonProps {
  pageId?: string;
  componentId?: string;
}

export const TagSearchItemSkeleton = ({
  pageId = '*',
  componentId = '*',
}: TagSearchItemSkeletonProps) => {
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    <div
      data-testid={accessibilityId}
      className={clsx(styles.tagSearchItemSkeleton, styles.tagSearchItemSkeleton__animation)}
    >
      <div className={styles.tagSearchItemSkeleton__leftPane}>
        <div
          className={clsx(
            styles.tagSearchItemSkeleton__tagIcon,
            styles.tagSearchItemSkeleton__animation,
          )}
        />
      </div>
      <div className={styles.tagSearchItemSkeleton__rightPane}>
        <div
          className={clsx(
            styles.tagSearchItemSkeleton__tagName,
            styles.tagSearchItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.tagSearchItemSkeleton__postCount,
            styles.tagSearchItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
