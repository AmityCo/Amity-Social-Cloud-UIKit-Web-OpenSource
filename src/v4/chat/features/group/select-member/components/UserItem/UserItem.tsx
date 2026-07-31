import { FileRepository } from '@amityco/ts-sdk';
import { Skeleton } from '~/v4/core/design/components/Skeleton/Skeleton';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { BrandBadge } from '~/v4/social/elements/BrandBadge/BrandBadge';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import styles from './UserItem.module.css';

type UserItemProps = {
  user: Amity.User;
};

export function UserItem({ user }: UserItemProps) {
  const displayName = user.displayName ?? user.userId;
  const initials = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'small')
    : undefined;

  return (
    <div className={styles.userItem}>
      <Avatar
        variant={imageUrl ? 'image' : 'text'}
        shape="rounded"
        size={40}
        imageUrl={imageUrl}
        initials={initials}
        alt={displayName}
      />
      <div className={styles.userItem__nameRow}>
        <Typography.BodyBold className={styles.userItem__name}>{displayName}</Typography.BodyBold>
        {user.isBrand && <BrandBadge className={styles.userItem__brandBadge} />}
      </div>
    </div>
  );
}

function UserItemSkeleton() {
  return (
    <div className={styles.userItem__skeletonRow}>
      <Skeleton.Circle width="2.5rem" height="2.5rem" />
      <Skeleton.Line width="8.75rem" height="0.625rem" />
    </div>
  );
}

UserItem.Skeleton = UserItemSkeleton;
