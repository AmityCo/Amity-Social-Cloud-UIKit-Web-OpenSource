import { Typography } from '~/v4/core/components/Typography/Typography';
import { CommentExclamation } from '~/v4/core/design/icons/CommentExclamation';
import { useString } from '~/v4/core/localization';
import styles from './BannedEmptyState.module.css';

export function BannedEmptyState() {
  const title = useString('amity_chat_error_banned_chat_title');
  const subtitle = useString('amity_chat_error_banned_chat_sub_title');
  return (
    <div className={styles.bannedEmptyState}>
      <CommentExclamation.Light className={styles.bannedEmptyState__icon} />
      <div className={styles.bannedEmptyState__text}>
        <Typography.TitleBold className={styles.bannedEmptyState__title}>
          {title}
        </Typography.TitleBold>
        <Typography.Caption className={styles.bannedEmptyState__subtitle}>
          {subtitle}
        </Typography.Caption>
      </div>
    </div>
  );
}
