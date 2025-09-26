import React from 'react';
import styles from './UnblockUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';

interface UnblockUserButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export const UnblockUserButton: React.FC<UnblockUserButtonProps> = ({
  pageId = '*',
  componentId = '*',
  onClick,
}) => {
  const elementId = 'unblock_user_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.unblockUserButton} onPress={onClick}>
      <div className={styles.unblockUserButton__inner}>
        {config.text && (
          <Typography.BodyBold className={styles.unblockUserButton__text}>
            {config.text}
          </Typography.BodyBold>
        )}
      </div>
    </Button>
  );
};
