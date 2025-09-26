import React from 'react';
import styles from './CommunitySmallListSekeleton.module.css';

export const CommunitySmallListSekeleton = () => {
  return (
    <div className={styles.communitySmallListSekeleton}>
      <div className={styles.communitySmallListSekeleton__avatar}></div>
      <div className={styles.communitySmallListSekeleton__displayName}></div>
    </div>
  );
};
