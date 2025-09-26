import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button as $Button, ButtonProps as $ButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

export type ButtonProps = $ButtonProps & {
  iconClassName?: string;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'alert';
  variant?: 'fill' | 'outlined' | 'text';
  fullWidth?: boolean;
  ref?: React.Ref<any>;
  icon?: React.ReactNode | ((props: { className?: string }) => React.ReactNode);
};

export const Button = forwardRef(function (
  {
    icon,
    children,
    className,
    iconClassName,
    size = 'medium',
    variant = 'fill',
    color = 'primary',
    fullWidth = false,
    ...props
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <$Button
      {...props}
      ref={ref}
      data-icon={!!icon}
      data-label={!!children}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        styles[color],
        fullWidth && styles.fullWidth,
        className,
      )}
    >
      {typeof icon === 'function'
        ? icon({ className: styles.icon })
        : icon &&
          React.cloneElement(icon as React.ReactElement, {
            className: clsx(styles.icon, iconClassName),
          })}
      {children}
    </$Button>
  );
});
