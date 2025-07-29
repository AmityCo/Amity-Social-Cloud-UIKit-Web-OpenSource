import React from 'react';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from './ProfileMenuItem.module.css';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';

type ProfileMenuItemProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  profileImageUrl?: string;
  userName?: string;
  userTitle?: string;
};

export function ProfileMenuItem({
  pageId = '*',
  componentId = '*',
  className,
  profileImageUrl,
  userName = 'My Profile',
  userTitle = '',
}: ProfileMenuItemProps) {
  const elementId = 'profile_sidebar_menu_item';
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
      className={clsx(styles.profileMenuItem, className)}
    >
      <div className={styles.profileMenuItem__content} data-active={isActive}>
        <UserProfileHeader user={user} pageId={pageId} />
      </div>
    </Button>
  );
}
