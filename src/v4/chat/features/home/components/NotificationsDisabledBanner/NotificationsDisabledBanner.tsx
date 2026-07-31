import { Typography } from '~/v4/core/components/Typography/Typography';
import { BellSlash } from '~/v4/core/design/icons/BellSlash';
import { useString } from '~/v4/core/localization';
import styles from './NotificationsDisabledBanner.module.css';

export function NotificationsDisabledBanner() {
  const text = useString('amity_chat_notifications_disabled');
  return (
    <div className={styles.notificationsDisabledBanner} role="status">
      <BellSlash className={styles.notificationsDisabledBanner__icon} />
      <Typography.Caption className={styles.notificationsDisabledBanner__text}>
        {text}
      </Typography.Caption>
    </div>
  );
}
