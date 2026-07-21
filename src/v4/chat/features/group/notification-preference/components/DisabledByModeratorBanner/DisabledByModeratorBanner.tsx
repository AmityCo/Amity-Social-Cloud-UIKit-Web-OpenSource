import { Typography } from '~/v4/core/components/Typography/Typography';
import { BellSlash } from '~/v4/core/design/icons/BellSlash';
import { useString } from '~/v4/core/localization';
import styles from './DisabledByModeratorBanner.module.css';

export function DisabledByModeratorBanner() {
  const text = useString('amity_chat_group_notifications_disabled');
  return (
    <div className={styles.disabledByModeratorBanner} role="status">
      <BellSlash className={styles.disabledByModeratorBanner__icon} />
      <Typography.Caption className={styles.disabledByModeratorBanner__text}>
        {text}
      </Typography.Caption>
    </div>
  );
}
