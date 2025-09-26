import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './MyCommunitiesSideBarItemSkeleton.module.css';

type MyCommunitiesSideBarItemSkeleton = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
};

export const MyCommunitiesSideBarItemSkeleton = ({
  pageId = '*',
  elementId = '*',
  componentId = '*',
}: MyCommunitiesSideBarItemSkeleton) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  return (
    <div className={styles.myCommunitiesSideBarItemSkeleton} style={themeStyles}>
      <div
        className={clsx(
          styles.myCommunitiesSideBarItemSkeleton__avatar,
          styles.myCommunitiesSideBarItemSkeleton__animation,
        )}
      />
      <div
        className={clsx(
          styles.myCommunitiesSideBarItemSkeleton__content,
          styles.myCommunitiesSideBarItemSkeleton__animation,
        )}
      >
        <div
          className={clsx(
            styles.myCommunitiesSideBarItemSkeleton__contentBar1,
            styles.myCommunitiesSideBarItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.myCommunitiesSideBarItemSkeleton__contentBar1,
            styles.myCommunitiesSideBarItemSkeleton__animation,
          )}
        />
        <div
          className={clsx(
            styles.myCommunitiesSideBarItemSkeleton__contentBar2,
            styles.myCommunitiesSideBarItemSkeleton__animation,
          )}
        />
      </div>
    </div>
  );
};
