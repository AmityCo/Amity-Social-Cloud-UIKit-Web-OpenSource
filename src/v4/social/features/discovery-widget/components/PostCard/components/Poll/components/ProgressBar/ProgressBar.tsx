import { POLL_PROGRESS_SEGMENTS } from '~/v4/social/features/discovery-widget/constants';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  percentage: number;
  isLeading: boolean;
};

export function ProgressBar({ percentage, isLeading }: ProgressBarProps) {
  const filledSegments = Math.floor(percentage / (100 / POLL_PROGRESS_SEGMENTS));

  return (
    <div className={styles.progressBar} data-leading={isLeading} aria-hidden="true">
      {Array.from({ length: POLL_PROGRESS_SEGMENTS }).map((_, index) => (
        <span
          key={index}
          className={styles.progressBar__segment}
          data-filled={index < filledSegments}
        />
      ))}
    </div>
  );
}
