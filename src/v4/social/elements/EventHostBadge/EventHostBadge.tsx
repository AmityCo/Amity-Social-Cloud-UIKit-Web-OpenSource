import { Host } from '~/v4/icons/Host';
import { useString } from '~/v4/core/localization';
import styles from './EventHostBadge.module.css';
import { Typography } from '~/v4/core/components';

type EventHostBadgeProps = {
  pageId?: string;
  componentId?: string;
  withLabel?: boolean;
};

export function EventHostBadge({
  pageId = '*',
  componentId = '*',
  withLabel = false,
}: EventHostBadgeProps) {
  const hostLabel = useString('amity_social_button_host');

  return (
    <div
      className={styles.eventHostBadge}
      data-label={withLabel}
      data-testid={`${pageId}/${componentId}/host_badge`}
    >
      <Host className={styles.eventHostBadge__icon} />
      {withLabel && (
        <Typography.CaptionSmall className={styles.eventHostBadge__label}>
          {hostLabel}
        </Typography.CaptionSmall>
      )}
    </div>
  );
}
