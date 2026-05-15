import React from 'react';
import styles from './PendingUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';

import PendingUser from '~/v4/icons/PendingUser';

interface PendingUserButtonProps {
  pageId?: string;
  componentId?: string;
  onClick: () => void;
}

export const PendingUserButton: React.FC<PendingUserButtonProps> = ({
  pageId = '*',
  componentId = '*',
  onClick,
}) => {
  const elementId = 'pending_user_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.pendingUserButton} onPress={onClick}>
      <div className={styles.pendingUserButton__inner}>
        <IconComponent
          defaultIcon={() => <PendingUser className={styles.pendingUserButton__icon} />}
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} />}
        />
        {resolveText('amity_social_button_cancel_request') && (
          <Typography.BodyBold className={styles.pendingUserButton__text}>
            {resolveText('amity_social_button_cancel_request')}
          </Typography.BodyBold>
        )}
      </div>
    </Button>
  );
};
