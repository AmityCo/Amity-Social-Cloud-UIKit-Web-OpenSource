import clsx from 'clsx';
import React, { forwardRef } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { Check1 } from '~/v4/core/design/icons/Check1';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<AriaCheckboxProps, 'children' | 'style'> & {
  className?: string;
  children?: React.ReactNode;
};

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(
  { className, children, ...props },
  ref,
) {
  return (
    <AriaCheckbox
      {...props}
      ref={ref}
      data-layout={children != null ? 'row' : undefined}
      className={clsx(styles.selection, className)}
    >
      {children}
      <span className={styles.selection__circle}>
        <Check1.Solid className={styles.selection__check} />
      </span>
    </AriaCheckbox>
  );
});
