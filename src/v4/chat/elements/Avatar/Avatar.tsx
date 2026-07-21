import clsx from 'clsx';
import { useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { ImageViewer } from '~/v4/chat/features/shared/components/ImageViewer';
import { ModeratorBadge } from '~/v4/core/design/elements/ModeratorBadge';
import { CommentsAlt } from '~/v4/core/design/icons/CommentsAlt';
import { User as UserIcon } from '~/v4/core/design/icons/User';
import { PrivateBadge } from '~/v4/core/design/elements/PrivateBadge';
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
  const isDeleted = !!user.isDeleted;
  const displayName = user.displayName ?? user.userId ?? '';
  const firstChar = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl =
    !isDeleted && user.avatar?.fileUrl
      ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'large')
      : undefined;

  const content = (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt={displayName} className={styles.avatar__userImg} />
      ) : (
        <div className={styles.avatar__userPlaceholder}>
          {isDeleted ? (
            <UserIcon.Solid className={styles.avatar__userDeletedIcon} />
          ) : (
            <Typography.TitleBold className={styles.avatar__userPlaceholderText}>
              {firstChar}
            </Typography.TitleBold>
          )}
        </div>
      )}
      {isModerator && !isDeleted && (
        <ModeratorBadge className={styles.avatar__userModeratorBadge} />
      )}
    </>
  );

  if (fullscreen && imageUrl) {
    return (
      <>
        <AriaButton
          data-size={size}
          aria-label="View profile picture"
          onPress={() => setIsViewerOpen(true)}
          className={clsx(styles.avatar__user, className)}
        >
          {content}
        </AriaButton>
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
            <CommentsAlt.Solid className={styles.avatar__groupChatPlaceholderIcon} />
          </div>
        )}
      </div>
      {isPrivate && (
        <PrivateBadge
          className={styles.avatar__groupChatPrivateBadge}
          size={size === 'lg' ? 32 : 16}
          border
        />
      )}
    </div>
  );
}

export const Avatar = { User, GroupChat };
