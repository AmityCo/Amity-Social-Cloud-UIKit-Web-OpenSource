import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './CommunityRowItemSkeleton.module.css';

interface CommunityRowItemSkeleton {
  pageId?: string;
  componentId?: string;
  elementId?: string;
}

export const CommunityRowItemSkeleton = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
}: CommunityRowItemSkeleton) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  return (
    <div className={styles.communityRowItemSkeleton} style={themeStyles}>
      <div
        className={clsx(
          styles.communityRowItemSkeleton__avatar,
          styles.communityRowItemSkeleton__animation,
        )}
      />
      <div
        className={clsx(
          styles.communityRowItemSkeleton__content,
          styles.communityRowItemSkeleton__animation,
        )}
      >
        <div
          className={clsx(
            styles.communityRowItemSkeleton__contentBar1,
            styles.communityRowItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.communityRowItemSkeleton__contentBar2,
            styles.communityRowItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
