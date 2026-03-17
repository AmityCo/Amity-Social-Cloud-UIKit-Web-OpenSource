import clsx from 'clsx';
import React from 'react';
import { Checkbox as $Checkbox, CheckboxProps as $CheckboxProps } from 'react-aria-components';
import styles from './Checkbox.module.css';

export type CheckboxProps = $CheckboxProps & {
  label?: React.ReactNode;
  checkboxIconClassname?: string;
};

export function Checkbox({
  label,
  className,
  checkboxIconClassname,
  isDisabled,
  ...props
}: CheckboxProps) {
  return (
    <$Checkbox
      {...props}
      isDisabled={isDisabled}
      data-disabled={isDisabled || undefined}
      className={clsx(styles.checkbox, className)}
    >
      <div
        data-testid="checkbox-icon"
        className={clsx(styles.checkbox__icon, checkboxIconClassname)}
      >
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      {label}
    </$Checkbox>
  );
}
