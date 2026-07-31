import { Skeleton } from '~/v4/core/design/components/Skeleton/Skeleton';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { VolumeSlash } from '~/v4/core/design/icons/VolumeSlash';
import { BrandBadge } from '~/v4/social/elements/BrandBadge/BrandBadge';
import { Ellipsis } from '~/v4/core/design/icons/Ellipsis';
import { ActionMenu, type ActionMenuItem } from '~/v4/chat/components/ActionMenu';
import styles from './MemberItem.module.css';

type MemberItemProps = {
  user: Amity.User;
  isModerator: boolean;
  isCurrentUser: boolean;
  isMuted?: boolean;
  isViewerModerator?: boolean;
  getActions?: () => ActionMenuItem[] | Promise<ActionMenuItem[]>;
};

export function MemberItem({
  user,
  getActions,
  isModerator,
  isCurrentUser,
  isMuted = false,
  isViewerModerator = false,
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
          <VolumeSlash className={styles.memberItem__mutedIcon} aria-label="Muted" />
        )}
      </div>
      {getActions && (
        <ActionMenu
          icon={<Ellipsis />}
          getItems={getActions}
          ariaLabel={`Actions for ${displayName}`}
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
