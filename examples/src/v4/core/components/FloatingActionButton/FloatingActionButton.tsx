import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'react-aria-components';
import styles from './FloatingActionButton.module.css';

export type FloatingActionButtonProps = ButtonProps & {
  icon?: React.ReactNode | ((props: { className?: string }) => React.ReactNode);
  iconClassName?: string;
  ref?: React.Ref<any>;
};

export const FloatingActionButton = forwardRef(function (
  { icon, children, className, iconClassName, ...props }: FloatingActionButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <Button {...props} ref={ref} className={clsx(styles.floatingActionButton, className)}>
      {typeof icon === 'function'
        ? icon({ className: clsx(styles.floatingActionButton__icon, iconClassName) })
        : icon &&
          React.cloneElement(icon as React.ReactElement, {
            className: clsx(styles.floatingActionButton__icon, iconClassName),
          })}
    </Button>
  );
});
