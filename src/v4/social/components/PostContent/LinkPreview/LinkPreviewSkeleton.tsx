import React from 'react';
import clsx from 'clsx';
import styles from './LinkPreviewSkeleton.module.css';

export function LinkPreviewSkeleton() {
  return (
    <div className={styles.linkPreviewSkeleton}>
      <div
        className={clsx(styles.linkPreviewSkeleton__image, styles.linkPreviewSkeleton__animation)}
      />
      <div className={styles.linkPreviewSkeleton__bottom}>
        <div
          className={clsx(styles.linkPreviewSkeleton__bar1, styles.linkPreviewSkeleton__animation)}
        />
        <div
          className={clsx(styles.linkPreviewSkeleton__bar2, styles.linkPreviewSkeleton__animation)}
        />
      </div>
    </div>
  );
}
