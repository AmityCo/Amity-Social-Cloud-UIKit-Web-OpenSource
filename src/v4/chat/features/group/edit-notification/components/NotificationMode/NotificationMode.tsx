import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './NotificationMode.module.css';

type NotificationModeProps = {
  title: string;
  description: string;
};

export function NotificationMode({ title, description }: NotificationModeProps) {
  return (
    <div className={styles.notificationMode}>
      <Typography.BodyBold className={styles.notificationMode__title}>{title}</Typography.BodyBold>
      <Typography.Caption className={styles.notificationMode__description}>
        {description}
      </Typography.Caption>
    </div>
  );
}
