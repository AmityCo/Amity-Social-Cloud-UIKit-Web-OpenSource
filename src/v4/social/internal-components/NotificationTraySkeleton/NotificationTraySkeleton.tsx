import React from 'react';
import styles from './NotificationTraySkeleton.module.css';

const NotificationHeaderSkeleton = () => (
  <div className={styles.notificationTraySkeleton__header}></div>
);

export const NotificationItemSkeleton = ({ index }: { index: number }) => (
  <div className={styles.notificationTraySkeleton} key={index}>
    <div className={styles.notificationTraySkeleton__avatar}></div>
    <div className={styles.notificationTraySkeleton__details}>
      <div className={styles.notificationTraySkeleton__displayName}></div>
      <div className={styles.notificationTraySkeleton__description}></div>
    </div>
  </div>
);

export const NotificationTraySkeleton = () => {
  return (
    <>
      <NotificationHeaderSkeleton />
      {[...Array(3)].map((_, index) => (
        <NotificationItemSkeleton key={`first-section-${index}`} index={index} />
      ))}
      <div className={styles.notificationTraySkeleton__divider} />
      <NotificationHeaderSkeleton />
      {[...Array(3)].map((_, index) => (
        <NotificationItemSkeleton key={`second-section-${index}`} index={index} />
      ))}
    </>
  );
};
