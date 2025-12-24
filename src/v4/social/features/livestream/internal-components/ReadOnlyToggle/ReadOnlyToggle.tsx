import clsx from 'clsx';
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
        <Typography.Body>Set live stream to read-only</Typography.Body>
        <Typography.Caption className={styles.readOnlyToggle__caption}>
          Members who are not streamer can read messages but cannot send any messages.
        </Typography.Caption>
      </div>
      <Switch isSelected={isSelected} onChange={onChange} />
    </div>
  );
};
