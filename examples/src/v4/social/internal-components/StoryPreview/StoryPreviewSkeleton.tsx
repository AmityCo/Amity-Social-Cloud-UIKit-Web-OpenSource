import React from 'react';
import styles from './StoryPreview.module.css';
import clsx from 'clsx';

type StoryPreviewSkeletonProps = {
  width?: number | string;
  height?: number | string;
};

export const StoryPreviewSkeleton: React.FC<StoryPreviewSkeletonProps> = ({
  width = '100%',
  height = '100%',
}) => {
  return (
    <div className={styles.storyPreviewWrapper} style={{ width, height }}>
      <div className={styles.storyPreviewContainer}>
        <div className={styles.shadowOverlay} />
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.userInfo}>
              <div className={styles.userInfoContent}>
                <div className={clsx(styles.avatarContainer, styles.skeleton)} />
                <div className={styles.textSkeleton}>
                  <div className={clsx(styles.nameSkeleton, styles.skeleton)}></div>
                  <div className={clsx(styles.timeSkeleton, styles.skeleton)}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={clsx(styles.mediaContainer, styles.skeleton)} />
        </div>
      </div>
    </div>
  );
};
