import React from 'react';
import styles from './UnblockUserButton.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';

import UnblockUser from '~/v4/icons/UnblockUser';

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
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button data-testid={accessibilityId} className={styles.unblockUserButton} onPress={onClick}>
      <div className={styles.unblockUserButton__inner}>
        <IconComponent
          defaultIcon={() => <UnblockUser className={styles.unblockUserButton__icon} />}
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} />}
        />
        {resolveText('amity_social_button_user_unblock_button') && (
          <Typography.BodyBold className={styles.unblockUserButton__text}>
            {resolveText('amity_social_button_user_unblock_button')}
          </Typography.BodyBold>
        )}
      </div>
    </Button>
  );
};
