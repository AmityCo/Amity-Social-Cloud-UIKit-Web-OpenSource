import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './NotificationModeRow.module.css';

type NotificationModeRowProps = {
  title: string;
  description: string;
};

export function NotificationModeRow({ title, description }: NotificationModeRowProps) {
  return (
    <span className={styles.notificationModeRow}>
      <Typography.BodyBold className={styles.notificationModeRow__title}>
        {title}
      </Typography.BodyBold>
      <Typography.Caption className={styles.notificationModeRow__description}>
        {description}
      </Typography.Caption>
    </span>
  );
}
