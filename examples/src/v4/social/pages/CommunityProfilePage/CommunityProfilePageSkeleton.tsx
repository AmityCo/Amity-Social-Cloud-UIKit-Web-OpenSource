import React from 'react';
import styles from './CommunityProfileSkeleton.module.css';

export const CommunityProfileSkeleton: React.FC = () => {
  return (
    <div className={styles.communityProfileSkeleton__container}>
      <div className={styles.communityProfileSkeleton__headerImage}></div>
      <div className={styles.communityProfileSkeleton__content}>
        <div className={styles.communityProfileSkeleton__title}></div>
        <div className={styles.communityProfileSkeleton__category__container}>
          <div className={styles.communityProfileSkeleton__category__item}></div>
          <div className={styles.communityProfileSkeleton__category__item}></div>
          <div className={styles.communityProfileSkeleton__category__item}></div>
        </div>
        <div className={styles.communityProfileSkeleton__description}></div>
        <div className={styles.communityProfileSkeleton__description}></div>
        <div className={styles.communityProfileSkeleton__communityInfo__container}>
          <div className={styles.communityProfileSkeleton__communityInfo__info}></div>
          <div className={styles.communityProfileSkeleton__communityInfo__info}></div>
        </div>
        <div className={styles.communityProfileSkeleton__storyTab}></div>
        <div className={styles.communityProfileSkeleton__storyTab__title}></div>
      </div>
    </div>
  );
};
