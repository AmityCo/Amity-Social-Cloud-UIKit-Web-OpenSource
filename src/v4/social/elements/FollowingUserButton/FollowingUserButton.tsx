import React from 'react';
import styles from './FollowingUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';

import FollowingUser from '~/v4/icons/FollowingUser';

interface FollowingUserButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export const FollowingUserButton: React.FC<FollowingUserButtonProps> = ({
  pageId = '*',
  componentId = '*',
  onClick,
}) => {
  const elementId = 'following_user_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.followingUserButton} onPress={onClick}>
      <div className={styles.followingUserButton__inner}>
        <IconComponent
          defaultIcon={() => <FollowingUser className={styles.followingUserButton__icon} />}
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} />}
        />
        {resolveText('amity_social_button_user_following_button') && (
          <Typography.BodyBold className={styles.followingUserButton__text}>
            {resolveText('amity_social_button_user_following_button')}
          </Typography.BodyBold>
        )}
      </div>
    </Button>
  );
};
