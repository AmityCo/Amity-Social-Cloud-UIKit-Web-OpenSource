import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import LiveDot from '~/v4/icons/LiveDot';
import UserOutlined from '~/v4/icons/UserOutlined';
import styles from './WatchingCountBadge.module.css';

function formatCount(count: number): string {
  // 1-999: show exact number
  if (count < 1000) {
    return count.toString();
  }

  // 1,000-999,999: show K for thousands
  if (count < 1000000) {
    const thousands = count / 1000;
    // Floor to 1 decimal place
    const floored = Math.floor(thousands * 10) / 10;

    // If it's a whole number, don't show decimal
    if (floored % 1 === 0) {
      return `${Math.floor(floored)}K`;
    }
    // Show 1 decimal place
    return `${floored.toFixed(1)}K`;
  }

  // 1,000,000+: show M for millions
  const millions = count / 1000000;
  // Floor to 1 decimal place
  const floored = Math.floor(millions * 10) / 10;

  // If it's a whole number, don't show decimal
  if (floored % 1 === 0) {
    return `${Math.floor(floored)}M`;
  }
  // Show 1 decimal place
  return `${floored.toFixed(1)}M`;
}

export function WatchingCountBadge({
  className,
  count,
  isWatcher,
}: {
  className?: string;
  count?: number;
  isWatcher?: boolean;
}) {
  return (
    <div className={clsx(styles.watchingCountBadge, className)}>
      {count ? (
        <>
          {isWatcher && <LiveDot className={styles.watchingCountBadge__liveDotIcon} />}
          <UserOutlined className={styles.watchingCountBadge__userIcon} />
          <Typography.CaptionBold className={styles.watchingCountBadge__text}>
            {formatCount(count)}
          </Typography.CaptionBold>
        </>
      ) : (
        <>
          <LiveDot className={styles.watchingCountBadge__liveDotIcon} />
          <Typography.CaptionBold className={styles.watchingCountBadge__text}>
            {'LIVE'}
          </Typography.CaptionBold>
        </>
      )}
    </div>
  );
}
