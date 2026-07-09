import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import styles from './MemberPermission.module.css';

type MemberPermissionProps = {
  titleKey: string;
  descriptionKey: string;
};

export function MemberPermission({ titleKey, descriptionKey }: MemberPermissionProps) {
  const title = useString(titleKey);
  const description = useString(descriptionKey);
  return (
    <span className={styles.memberPermission}>
      <Typography.BodyBold className={styles.memberPermission__title}>{title}</Typography.BodyBold>
      <Typography.Caption className={styles.memberPermission__description}>
        {description}
      </Typography.Caption>
    </span>
  );
}
