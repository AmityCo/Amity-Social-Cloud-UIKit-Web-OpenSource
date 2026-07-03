import { Typography } from '~/v4/core/components/Typography/Typography';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './YouTile.module.css';

type YouTileProps = {
  user: Amity.User;
  label?: string;
};

export function YouTile({ user, label = resolveString('amity_chat_member_you') }: YouTileProps) {
  return (
    <div className={styles.youTile}>
      <Avatar.User user={user} size="md" isModerator />
      <Typography.Caption className={styles.youTile__name}>{label}</Typography.Caption>
    </div>
  );
}
