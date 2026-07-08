import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { Archive } from '~/v4/icons/Archive';
import styles from './ArchivedBadge.module.css';

export function ArchivedBadge() {
  const label = useString('amity_chat_archived_badge_label');
  return (
    <div className={styles.archivedBadge}>
      <Archive className={styles.archivedBadge__icon} aria-hidden="true" />
      <Typography.CaptionSmall className={styles.archivedBadge__text}>
        {label}
      </Typography.CaptionSmall>
    </div>
  );
}
