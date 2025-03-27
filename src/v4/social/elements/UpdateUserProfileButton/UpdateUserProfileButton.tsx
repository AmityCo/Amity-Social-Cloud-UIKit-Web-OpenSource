import React from 'react';
import styles from './UpdateUserProfileButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';

interface UpdateUserProfileButtonProps {
  pageId?: string;
  componentId?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const UpdateUserProfileButton: React.FC<UpdateUserProfileButtonProps> = ({
  pageId = '*',
  componentId = '*',
  disabled = false,
  onClick,
}) => {
  const elementId = 'update_user_profile_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      data-testid={accessibilityId}
      className={styles.updateUserProfileButton}
      onPress={onClick}
      isDisabled={disabled}
      type="submit"
    >
      {config.text && (
        <Typography.Body className={styles.updateUserProfileButton__text}>
          {config.text}
        </Typography.Body>
      )}
    </Button>
  );
};
