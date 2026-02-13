import clsx from 'clsx';
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
          <Typography.Body>Allow co-host to manage product tags</Typography.Body>
          <Typography.Caption className={styles.coHostToggleProductPermission__caption}>
            When enabled, co-host can add or remove tagged products and pin or unpin a product
            during the live stream.
          </Typography.Caption>
        </div>
        <Switch isSelected={isSelected} onChange={onChange} />
      </div>
    </div>
  );
};
