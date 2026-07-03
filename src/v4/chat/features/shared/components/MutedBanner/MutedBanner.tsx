import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import styles from './MutedBanner.module.css';

type MutedBannerProps = {
  variant: 'user' | 'channel' | 'blocked';
};

export function MutedBanner({ variant }: MutedBannerProps) {
  const userMutedMessage = useString('amity_chat_user_is_muted');
  const channelMutedMessage = useString('amity_chat_group_permission_only_moderators_banner');
  const blockedMessage = useString('amity_chat_blocked_message');

  const message =
    variant === 'user'
      ? userMutedMessage
      : variant === 'channel'
        ? channelMutedMessage
        : blockedMessage;

  return (
    <div className={styles.mutedBanner} role="status">
      <Typography.Caption className={styles.mutedBanner__text}>{message}</Typography.Caption>
    </div>
  );
}
