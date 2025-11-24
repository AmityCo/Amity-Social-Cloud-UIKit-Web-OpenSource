import { Typography } from '~/v4/core/components';
import { EVENT_TYPE } from '~/v4/social/features/events/constants';
import styles from './EventTypeBadge.module.css';

type EventTypeBadgeProps = {
  type: Amity.EventType;
};

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
  return (
    <Typography.CaptionBold className={styles.eventTypeBadge}>
      {EVENT_TYPE[type]}
    </Typography.CaptionBold>
  );
}
