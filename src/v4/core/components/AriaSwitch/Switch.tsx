import clsx from 'clsx';
import React from 'react';
import { Switch as $Switch, SwitchProps as $SwitchProps } from 'react-aria-components';
import styles from './Switch.module.css';

type SwitchProps = $SwitchProps & {
  label?: React.ReactNode;
  'data-testid'?: string;
};

export function Switch({ label, className, ...props }: SwitchProps) {
  return (
    <$Switch {...props} className={clsx(styles.switch, className)}>
      <div className={styles.switch__indicator} />
      {label}
    </$Switch>
  );
}
