import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { Switch } from '~/v4/core/components/AriaSwitch';
import styles from './ReadOnlyToggle.module.css';

export interface ReadOnlyToggleProps {
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  className?: string;
}

export const ReadOnlyToggle: React.FC<ReadOnlyToggleProps> = ({
  isSelected,
  onChange,
  className,
}) => {
  return (
    <div className={clsx(styles.readOnlyToggle, className)}>
      <div>
        <Typography.Body>
          {useString('amity_social_status_set_livestream_read_only')}
        </Typography.Body>
        <Typography.Caption className={styles.readOnlyToggle__caption}>
          {useString('amity_social_label_livestream_read_only_description')}
        </Typography.Caption>
      </div>
      <Switch isSelected={isSelected} onChange={onChange} />
    </div>
  );
};
