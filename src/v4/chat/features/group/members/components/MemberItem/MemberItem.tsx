import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { IconButton } from '~/v4/chat/elements/IconButton';
import Muted from '~/v4/icons/Muted';
import { BrandBadge } from '~/v4/social/elements/BrandBadge/BrandBadge';
import styles from './MemberItem.module.css';

type MemberItemProps = {
  user: Amity.User;
  isModerator: boolean;
  isCurrentUser: boolean;
  isMuted?: boolean;
  isViewerModerator?: boolean;
  onActionPress?: () => void;
};

export function MemberItem({
  user,
  isModerator,
  isCurrentUser,
  isMuted = false,
  isViewerModerator = false,
  onActionPress,
}: MemberItemProps) {
  const displayName = user.displayName ?? user.userId;
  const youSuffix = useString('amity_chat_member_you_suffix');
  return (
    <div className={styles.memberItem}>
      <Avatar.User user={user} size="md" isModerator={isModerator} />
      <div className={styles.memberItem__nameRow}>
        <Typography.BodyBold className={styles.memberItem__name}>{displayName}</Typography.BodyBold>
        {user.isBrand && <BrandBadge className={styles.memberItem__brandBadge} />}
        {isCurrentUser && (
          <Typography.BodyBold className={styles.memberItem__youSuffix}>
            {youSuffix}
          </Typography.BodyBold>
        )}
        {isViewerModerator && isMuted && (
          <Muted className={styles.memberItem__mutedIcon} aria-label="Muted" />
        )}
      </div>
      {onActionPress && (
        <IconButton
          icon="ellipsis"
          variant="transparent"
          onPress={onActionPress}
          aria-label={`Actions for ${displayName}`}
        />
      )}
    </div>
  );
}

function MemberItemSkeleton() {
  return (
    <Skeleton className={styles.memberItem}>
      <Skeleton.Circle width="2.5rem" height="2.5rem" />
      <Skeleton className={styles.memberItem__nameRow}>
        <Skeleton.Line width="8.75rem" height="0.625rem" />
      </Skeleton>
    </Skeleton>
  );
}

MemberItem.Skeleton = MemberItemSkeleton;
