import React from 'react';
import styles from './UserFeedTabButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Feed } from '~/v4/icons/Feed';
import { Button } from '~/v4/core/natives/Button';

interface UserFeedTabButtonProps {
  pageId?: string;
  componentId?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const UserFeedTabButton: React.FC<UserFeedTabButtonProps> = ({
  pageId = '*',
  componentId = '*',
  isActive,
  onClick,
}) => {
  const elementId = 'user_feed_tab_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      data-testid={accessibilityId}
      data-active={isActive}
      className={styles.userFeedTabButton}
      onPress={onClick}
    >
      <IconComponent
        defaultIcon={() => (
          <Feed className={styles.userFeedTabButton__icon} data-active={isActive} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
    </Button>
  );
};
