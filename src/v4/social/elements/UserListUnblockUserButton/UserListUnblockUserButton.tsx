import React from 'react';
import styles from './UserListUnblockUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';

import UnblockUser from '~/v4/icons/UnblockUser';

interface UserListUnblockUserButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export const UserListUnblockUserButton: React.FC<UserListUnblockUserButtonProps> = ({
  pageId = '*',
  componentId = '*',
  onClick,
}) => {
  const elementId = 'user_list_unblock_user_button';
  const { accessibilityId, config, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      data-testid={accessibilityId}
      className={styles.userListUnblockUserButton}
      onPress={onClick}
    >
      {resolveText('amity_social_button_unblock') && (
        <Typography.CaptionBold className={styles.userListUnblockUserButton__text}>
          {resolveText('amity_social_button_unblock')}
        </Typography.CaptionBold>
      )}
    </Button>
  );
};
