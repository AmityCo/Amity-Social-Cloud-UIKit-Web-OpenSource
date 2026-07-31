import { Toggle } from '~/v4/core/design/atoms/Toggle';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import styles from './AllowNotifications.module.css';

type AllowNotificationsProps = {
  isSelected: boolean;
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
};

export function AllowNotifications({
  isSelected,
  isDisabled = false,
  onChange,
}: AllowNotificationsProps) {
  const title = useString('amity_chat_group_notification_preference_title');
  const description = useString('amity_chat_group_notification_preference_description');
  return (
    <div className={styles.allowNotifications} data-disabled={isDisabled ? 'true' : 'false'}>
      <div className={styles.allowNotifications__textBlock}>
        <Typography.BodyBold className={styles.allowNotifications__title}>
          {title}
        </Typography.BodyBold>
        <Typography.Caption className={styles.allowNotifications__description}>
          {description}
        </Typography.Caption>
      </div>
      <Toggle isOn={isSelected} isDisabled={isDisabled} onChange={onChange} aria-label={title} />
    </div>
  );
}
