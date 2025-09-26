import React from 'react';
import styles from './PendingPostsSkeleton.module.css';

export const PendingPostSkeleton = () => {
  return (
    <div className={styles.pendingPostSkeleton}>
      <div className={styles.pendingPostSkeleton__header}>
        <div className={styles.pendingPostSkeleton__avatar}></div>
        <div className={styles.pendingPostSkeleton__userInfo}>
          <div className={styles.pendingPostSkeleton__username}></div>
          <div className={styles.pendingPostSkeleton__subtitle}></div>
        </div>
      </div>
      <div className={styles.pendingPostSkeleton__content}>
        <div className={styles.pendingPostSkeleton__line}></div>
        <div className={styles.pendingPostSkeleton__line}></div>
        <div className={styles.pendingPostSkeleton__line}></div>
        <div className={styles.pendingPostSkeleton__cta}></div>
      </div>
    </div>
  );
};
