import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { Switch } from '~/v4/core/components/AriaSwitch';
import styles from './CoHostToggleProductPermission.module.css';

export interface CoHostToggleProductPermissionProps {
  isSelected?: boolean;
  onChange: (isSelected: boolean) => void;
  className?: string;
}

export const CoHostToggleProductPermission: React.FC<CoHostToggleProductPermissionProps> = ({
  isSelected,
  onChange,
  className,
}) => {
  return (
    <div className={clsx(styles.coHostToggleProductPermission, className)}>
      <div className={styles.coHostToggleProductPermission__content}>
        <div className={styles.coHostToggleProductPermission__label}>
          <Typography.Body>
            {useString('amity_social_label_allow_co_host_to_manage_product_tags')}
          </Typography.Body>
          <Typography.Caption className={styles.coHostToggleProductPermission__caption}>
            {useString(
              'amity_social_status_when_enabled_co_host_can_add_or_remove_tagged_products_',
            )}
          </Typography.Caption>
        </div>
        <Switch isSelected={isSelected} onChange={onChange} />
      </div>
    </div>
  );
};
