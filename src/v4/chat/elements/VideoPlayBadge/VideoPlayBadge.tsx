import clsx from 'clsx';
import { VideoPlay } from '~/v4/core/design/icons/VideoPlay';
import styles from './VideoPlayBadge.module.css';

type VideoPlayBadgeProps = {
  size?: 20 | 24 | 40;
  className?: string;
};

export function VideoPlayBadge({ size = 40, className }: VideoPlayBadgeProps) {
  return (
    <span className={clsx(styles.videoPlayBadge, className)} data-size={size} aria-hidden="true">
      <VideoPlay className={styles.videoPlayBadge__icon} />
    </span>
  );
}
