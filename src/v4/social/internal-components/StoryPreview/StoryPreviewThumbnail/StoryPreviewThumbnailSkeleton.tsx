import clsx from 'clsx';
import React from 'react';
import styles from './StoryPreviewThumbnail.module.css';

export const StoryPreviewThumbnailSkeleton: React.FC = () => {
  return (
    <div className={clsx(styles.skeletonContainer, styles.skeleton)}>
      <div className={styles.header}>
        <div className={clsx(styles.avatarSkeleton, styles.skeleton)}></div>
        <div className={styles.textSkeleton}>
          <div className={clsx(styles.nameSkeleton, styles.skeleton)}></div>
          <div className={clsx(styles.timeSkeleton, styles.skeleton)}></div>
        </div>
      </div>
    </div>
  );
};
