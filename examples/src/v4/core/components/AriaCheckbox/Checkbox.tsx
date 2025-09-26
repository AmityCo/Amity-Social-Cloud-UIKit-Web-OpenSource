import clsx from 'clsx';
import React from 'react';
import { Checkbox as $Checkbox, CheckboxProps as $CheckboxProps } from 'react-aria-components';
import styles from './Checkbox.module.css';

export type CheckboxProps = $CheckboxProps & {
  label?: React.ReactNode;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <$Checkbox {...props} className={clsx(styles.checkbox, className)}>
      <div className={styles.checkbox__icon}>
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      {label}
    </$Checkbox>
  );
}
