import { Button } from '~/v4/core/components/AriaButton/Button';
import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { BrandBadge } from '~/v4/social/elements/BrandBadge/BrandBadge';
import { Avatar } from '~/v4/chat/elements/Avatar';
import styles from './UserItem.module.css';

type UserItemProps = {
  user: Amity.User;
  onPress: (user: Amity.User) => void;
};

export function UserItem({ user, onPress }: UserItemProps) {
  const displayName = user.displayName ?? user.userId;
  return (
    <Button
      variant="default"
      className={styles.userItem}
      onPress={() => onPress(user)}
      aria-label={`Start chat with ${displayName}`}
    >
      <Avatar.User user={user} size="md" />
      <div className={styles.userItem__nameRow}>
        <Typography.BodyBold className={styles.userItem__name}>{displayName}</Typography.BodyBold>
        {user.isBrand && <BrandBadge className={styles.userItem__brandBadge} />}
      </div>
    </Button>
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
