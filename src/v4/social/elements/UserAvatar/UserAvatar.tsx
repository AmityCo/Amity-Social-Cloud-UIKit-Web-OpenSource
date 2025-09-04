import clsx from 'clsx';
import React from 'react';
import Badge from '~/v4/icons/Badge';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import styles from './UserAvatar.module.css';

type UserAvatarProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  userId?: string | null;
  isShowModeratorBadge?: boolean;
  imageContainerClassName?: string;
  textPlaceholderClassName?: string;
  shouldRedirectToUserProfile?: boolean;
  onPressAvatar?: () => void;
  userData?: Amity.User;
};

export function UserAvatar({
  userId,
  className,
  pageId = '*',
  componentId = '*',
  imageContainerClassName,
  isShowModeratorBadge = false,
  textPlaceholderClassName = '',
  shouldRedirectToUserProfile = false,
  onPressAvatar,
  userData,
}: UserAvatarProps) {
  const elementId = 'user_avatar';

  const { onClickUser } = useNavigation();
  const { user, isLoading } = useUser({ userId, shouldCall: !!userId });
  const userImage = useImage({
    fileId: userData?.avatarFileId || user?.avatar?.fileId,
  });
  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const { closePopup } = usePopupContext();

  const displayName =
    userData?.displayName || userData?.userId || user?.displayName || user?.userId || '';
  const firstChar = displayName?.trim().charAt(0).toUpperCase();

  if (isLoading && !userData)
    return <div className={clsx(styles.userAvatar__skeleton, className)} />;

  const handleAvatarClick = () => {
    if (!userId) return;
    if (userId && shouldRedirectToUserProfile) {
      closePopup();
      onClickUser(userId);
    } else if (onPressAvatar && !shouldRedirectToUserProfile) {
      onPressAvatar();
    } else {
      shouldRedirectToUserProfile && onClickUser(userId);
    }
  };

  if (userImage) {
    return (
      <Button
        onPress={() => handleAvatarClick()}
        className={clsx(styles.userAvatar__container, imageContainerClassName)}
      >
        <img
          src={userImage}
          data-testid={`${accessibilityId}-${user?.userId}`}
          className={clsx(styles.userAvatar__img, className)}
        />
        {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
      </Button>
    );
  }

  return (
    <Button
      data-testid={`${accessibilityId}-${user?.userId}`}
      className={clsx(styles.userAvatar__placeholder, className)}
      onPress={() => handleAvatarClick()}
      data-testid={`user-avatar-${userId}`}
    >
      <Typography.TitleBold
        data-testid={`user-avatar-${userId}`}
        className={clsx(styles.userAvatar__placeholder__text, textPlaceholderClassName)}
      >
        {firstChar}
      </Typography.TitleBold>
      {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
    </Button>
  );
}
