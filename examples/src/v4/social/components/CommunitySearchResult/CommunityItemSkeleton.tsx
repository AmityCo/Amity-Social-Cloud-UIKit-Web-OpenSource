import React from 'react';
import clsx from 'clsx';
import styles from './CommunityItemSkeleton.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

interface CommunityItemSkeletonProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityItemSkeleton = ({
  pageId = '*',
  componentId = '*',
}: CommunityItemSkeletonProps) => {
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={clsx(styles.communityItemSkeleton, styles.communityItemSkeleton__animation)}
    >
      <div className={styles.communityItemSkeleton__leftPane}>
        <div
          className={clsx(
            styles.communityItemSkeleton__userAvatar,
            styles.communityItemSkeleton__animation,
          )}
        />
      </div>
      <div
        className={clsx(
          styles.communityItemSkeleton__information,
          styles.communityItemSkeleton__animation,
        )}
      >
        <div
          className={clsx(
            styles.communityItemSkeleton__information__title,
            styles.communityItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.communityItemSkeleton__information__subtitle,
            styles.communityItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
