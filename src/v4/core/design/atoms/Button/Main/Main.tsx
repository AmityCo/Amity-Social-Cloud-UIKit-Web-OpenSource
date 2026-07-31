import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import styles from './Main.module.css';

export type MainColor = 'default' | 'destructive';
export type MainHierarchy = 'primary' | 'secondary';
export type MainStyleType =
  | 'filled'
  | 'outlined'
  | 'ghost'
  | 'inverse'
  | 'link'
  | 'description'
  | 'transparent';
export type MainSize = 'lg' | 'sm';

export type MainProps = Omit<AriaButtonProps, 'style' | 'children'> & {
  color?: MainColor;
  hierarchy?: MainHierarchy;
  styleType?: MainStyleType;
  size?: MainSize;
  label?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  fullWidth?: boolean;
  className?: string;
};

export const Main = forwardRef<HTMLButtonElement, MainProps>(function Main(
  {
    color = 'default',
    hierarchy = 'primary',
    styleType = 'filled',
    size = 'lg',
    label,
    icon,
    iconClassName,
    fullWidth = false,
    className,
    ...props
  },
  ref,
) {
  const iconOnly = !!icon && !label;
  return (
    <AriaButton
      {...props}
      ref={ref}
      data-color={color}
      data-style={styleType}
      data-hierarchy={hierarchy}
      data-size={size}
      data-icon-only={iconOnly}
      className={clsx(styles.mainButton, fullWidth && styles.fullWidth, className)}
    >
      {icon ? <span className={clsx(styles.mainButton__icon, iconClassName)}>{icon}</span> : null}
      {label ? <span className={styles.mainButton__label}>{label}</span> : null}
    </AriaButton>
  );
});
