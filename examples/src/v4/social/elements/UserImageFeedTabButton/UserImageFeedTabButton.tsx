import React from 'react';
import styles from './UserImageFeedTabButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { ImageFeed } from '~/v4/icons/ImageFeed';
import { Button } from '~/v4/core/natives/Button';

interface UserImageFeedTabButtonProps {
  pageId?: string;
  componentId?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const UserImageFeedTabButton: React.FC<UserImageFeedTabButtonProps> = ({
  pageId = '*',
  componentId = '*',
  isActive,
  onClick,
}) => {
  const elementId = 'user_image_feed_tab_button';
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
      className={styles.userImageFeedTabButton}
      onPress={onClick}
    >
      <IconComponent
        defaultIcon={() => (
          <ImageFeed className={styles.userImageFeedTabButton__icon} data-active={isActive} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
    </Button>
  );
};
