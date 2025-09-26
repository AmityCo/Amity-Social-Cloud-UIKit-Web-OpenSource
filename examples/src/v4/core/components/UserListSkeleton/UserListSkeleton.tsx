import React from 'react';
import styles from './UserListSkeleton.module.css';

export const UserListSkeleton = () => {
  return (
    <div className={styles.userListSkeleton}>
      <div className={styles.userListSkeleton__avatar}></div>
      <div className={styles.userListSkeleton__displayName}></div>
    </div>
  );
};
