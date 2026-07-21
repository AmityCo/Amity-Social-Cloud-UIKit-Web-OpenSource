import { FileRepository } from '@amityco/ts-sdk';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import { ModeratorBadge } from '~/v4/core/design/elements/ModeratorBadge';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './YouTile.module.css';

type YouTileProps = {
  user: Amity.User;
  label?: string;
};

export function YouTile({ user, label = resolveString('amity_chat_member_you') }: YouTileProps) {
  const displayName = user.displayName ?? user.userId;
  const initials = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'small')
    : undefined;

  return (
    <div className={styles.youTile}>
      <Avatar
        variant={imageUrl ? 'image' : 'text'}
        shape="rounded"
        size={40}
        imageUrl={imageUrl}
        initials={initials}
        alt={displayName}
        indicator={<ModeratorBadge />}
      />
      <Typography.Caption className={styles.youTile__name}>{label}</Typography.Caption>
    </div>
  );
}
