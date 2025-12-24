import styles from './MediaFeedSkeleton.module.css';

export const MediaFeedSkeleton = () => {
  return (
    <div className={styles.mediaFeedSkeleton}>
      <div className={styles.mediaFeedSkeleton__item}></div>
      <div className={styles.mediaFeedSkeleton__item}></div>
      <div className={styles.mediaFeedSkeleton__item}></div>
      <div className={styles.mediaFeedSkeleton__item}></div>
      <div className={styles.mediaFeedSkeleton__item}></div>
      <div className={styles.mediaFeedSkeleton__item}></div>
    </div>
  );
};
