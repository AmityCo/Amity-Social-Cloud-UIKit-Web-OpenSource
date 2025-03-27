import React from 'react';
import styles from './UserVideoFeedTabButton.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { VideoFeed } from '~/v4/icons/VideoFeed';
import { Button } from '~/v4/core/natives/Button';

interface UserVideoFeedTabButtonProps {
  pageId?: string;
  componentId?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const UserVideoFeedTabButton: React.FC<UserVideoFeedTabButtonProps> = ({
  pageId = '*',
  componentId = '*',
  isActive,
  onClick,
}) => {
  const elementId = 'user_video_feed_tab_button';
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
      className={styles.userVideoFeedTabButton}
      onPress={onClick}
    >
      <IconComponent
        defaultIcon={() => (
          <VideoFeed className={styles.userVideoFeedTabButton__icon} data-active={isActive} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
    </Button>
  );
};
