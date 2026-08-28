import styles from './EventCard.module.css';

export type EventCardSkeletonProps = {
  className?: string;
};

export function EventCardSkeleton({ className }: EventCardSkeletonProps) {
  return (
    <div className={`${styles.eventCard__skeleton} ${className ?? ''}`.trim()} aria-hidden="true">
      <div className={styles.eventCard__skeletonThumbnail} />
      <div className={styles.eventCard__skeletonDetails}>
        <div className={styles.eventCard__skeletonLine} data-line="1" />
        <div className={styles.eventCard__skeletonLine} data-line="2" />
        <div className={styles.eventCard__skeletonLine} data-line="3" />
      </div>
    </div>
  );
}
