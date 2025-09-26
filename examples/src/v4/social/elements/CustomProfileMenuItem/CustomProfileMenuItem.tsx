import React from 'react';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from './CustomProfileMenuItem.module.css';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { FormattedMessage } from 'react-intl';

type CustomProfileMenuItemProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  profileImageUrl?: string;
  userName?: string;
  userTitle?: string;
  userId?: string | null;
  userBadgeTitle?: string;
};

export function CustomProfileMenuItem({
  pageId = '*',
  componentId = '*',
  className,
  profileImageUrl,
  userName = 'My Profile',
  userTitle = '',
  userId,
  userBadgeTitle,
}: CustomProfileMenuItemProps) {
  const elementId = 'custom_profile_sidebar_menu_item';
  const { currentUserId } = useSDK();
  const { page, goToUserProfilePage } = useNavigation();

  const { accessibilityId, config, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const isActive =
    page.type === PageTypes.UserProfilePage || page.type === PageTypes.EditUserProfilePage;

  const handleProfileClick = () => {
    if (currentUserId) {
      goToUserProfilePage(currentUserId);
    }
  };

  return (
    <Button
      onPress={handleProfileClick}
      style={themeStyles}
      data-active={isActive}
      data-testid={accessibilityId}
      className={clsx(styles.customProfileMenuItem, className)}
    >
      <div className={styles.customProfileMenuItem__container} data-active={isActive}>
        <UserAvatar
          userId={userId}
          className={styles.customProfileMenuItem__avatar}
          textPlaceholderClassName={styles.customProfileMenuItem__avatar__placeholder}
          pageId={pageId}
          componentId={componentId}
        />
        <div className={styles.userProfileButton__content}>
          <div className={styles.customProfileMenuItem__userNameWrapper} data-active={isActive}>
            {currentUserId}
          </div>
          {userBadgeTitle && <div className={styles.userBadge}>{userBadgeTitle}</div>}
        </div>
      </div>
    </Button>
  );
}
