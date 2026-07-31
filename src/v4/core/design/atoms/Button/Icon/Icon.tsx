import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import styles from './Icon.module.css';

export type IconStyleType = 'filled' | 'ghost' | 'transparent' | 'label';
export type IconHierarchy = 'primary' | 'secondary' | 'general';
export type IconSize = 16 | 20 | 24 | 32 | 40 | 48 | 64;

export type IconProps = Omit<AriaButtonProps, 'style' | 'children'> & {
  icon: React.ReactNode;
  styleType?: IconStyleType;
  hierarchy?: IconHierarchy;
  size?: IconSize;
  label?: string;
  iconClassName?: string;
  className?: string;
};

export const Icon = forwardRef<HTMLButtonElement, IconProps>(function Icon(
  {
    icon,
    styleType = 'filled',
    hierarchy = 'primary',
    size = 40,
    label,
    iconClassName,
    className,
    ...props
  },
  ref,
) {
  return (
    <AriaButton
      {...props}
      ref={ref}
      data-style={styleType}
      data-hierarchy={hierarchy}
      data-size={size}
      className={clsx(styles.iconButton, className)}
    >
      <span className={clsx(styles.iconButton__icon, iconClassName)}>{icon}</span>
      {styleType === 'label' && label ? (
        <span className={styles.iconButton__label}>{label}</span>
      ) : null}
    </AriaButton>
  );
});
