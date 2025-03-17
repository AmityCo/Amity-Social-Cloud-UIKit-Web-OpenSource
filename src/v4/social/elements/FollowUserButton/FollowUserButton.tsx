import React from 'react';
import styles from './FollowUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';

import { Plus } from '~/v4/icons/Plus';

interface FollowUserButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export const FollowUserButton: React.FC<FollowUserButtonProps> = ({
  pageId = '*',
  componentId = '*',
  onClick,
}) => {
  const elementId = 'follow_user_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.followUserButton} onPress={onClick}>
      <div className={styles.followUserButton__inner}>
        <IconComponent
          defaultIcon={() => <Plus className={styles.followUserButton__icon} />}
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} />}
        />
        {config.text && (
          <Typography.BodyBold className={styles.followUserButton__text}>
            {config.text}
          </Typography.BodyBold>
        )}
      </div>
    </Button>
  );
};
