import { Host } from '~/v4/icons/Host';
import styles from './EventHostBadge.module.css';
import { Typography } from '~/v4/core/components';

type EventHostBadgeProps = {
  withLabel?: boolean;
};

export function EventHostBadge({ withLabel = false }: EventHostBadgeProps) {
  return (
    <div className={styles.eventHostBadge} data-label={withLabel}>
      <Host className={styles.eventHostBadge__icon} />
      {withLabel && (
        <Typography.CaptionSmall className={styles.eventHostBadge__label}>
          Host
        </Typography.CaptionSmall>
      )}
    </div>
  );
}
