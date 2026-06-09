import clsx from 'clsx';
import { useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { ImageViewer } from '~/v4/chat/features/shared/components/ImageViewer';
import BadgeIcon from '~/v4/icons/Badge';
import { GroupChatBubble } from '~/v4/icons/GroupChatBubble';
import LockFilled from '~/v4/icons/LockFilled';
import styles from './Avatar.module.css';

type AvatarUserProps = {
  user: Amity.User;
  size?: 'sm' | 'md';
  isModerator?: boolean;
  className?: string;
  fullscreen?: boolean;
};

function User({
  user,
  size = 'md',
  isModerator = false,
  className,
  fullscreen = false,
}: AvatarUserProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const displayName = user.displayName ?? user.userId ?? '';
  const firstChar = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'large')
    : undefined;

  const content = (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt={displayName} className={styles.avatar__userImg} />
      ) : (
        <div className={styles.avatar__userPlaceholder}>
          <Typography.TitleBold className={styles.avatar__userPlaceholderText}>
            {firstChar}
          </Typography.TitleBold>
        </div>
      )}
      {isModerator && (
        <div className={styles.avatar__userModeratorBadge}>
          <BadgeIcon className={styles.avatar__userModeratorBadgeIcon} />
        </div>
      )}
    </>
  );

  if (fullscreen && imageUrl) {
    return (
      <>
        <Button
          variant="default"
          data-size={size}
          aria-label="View profile picture"
          onPress={() => setIsViewerOpen(true)}
          className={clsx(styles.avatar__user, className)}
        >
          {content}
        </Button>
        {isViewerOpen && <ImageViewer src={imageUrl} onClose={() => setIsViewerOpen(false)} />}
      </>
    );
  }

  return (
    <div data-size={size} className={clsx(styles.avatar__user, className)}>
      {content}
    </div>
  );
}

type AvatarGroupChatProps = {
  avatar?: Amity.File<'image'>;
  isPublic?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
  variant?: 'default' | 'banned';
};

function GroupChat({
  avatar,
  isPublic,
  size = 'sm',
  className,
  variant = 'default',
}: AvatarGroupChatProps) {
  const isBanned = variant === 'banned';
  const imageUrl =
    !isBanned && avatar?.fileUrl
      ? FileRepository.fileUrlWithSize(avatar.fileUrl, 'medium')
      : undefined;
  const isPrivate = !isBanned && isPublic === false;

  return (
    <div data-size={size} className={clsx(styles.avatar__groupChat, className)}>
      <div className={styles.avatar__groupChatImageWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt="Group chat" className={styles.avatar__groupChatImage} />
        ) : (
          <div className={styles.avatar__groupChatPlaceholder} data-variant={variant}>
            <GroupChatBubble className={styles.avatar__groupChatPlaceholderIcon} />
          </div>
        )}
      </div>
      {isPrivate && (
        <div className={styles.avatar__groupChatPrivateBadge}>
          <LockFilled className={styles.avatar__groupChatPrivateBadgeIcon} />
        </div>
      )}
    </div>
  );
}

export const Avatar = { User, GroupChat };
