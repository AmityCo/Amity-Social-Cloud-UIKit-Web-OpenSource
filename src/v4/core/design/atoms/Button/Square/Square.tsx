import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import styles from './Square.module.css';

export type SquareColor = 'default' | 'destructive';
export type SquareHierarchy = 'primary' | 'secondary';

export type SquareProps = Omit<AriaButtonProps, 'style' | 'children'> & {
  icon: React.ReactNode;
  label: string;
  color?: SquareColor;
  hierarchy?: SquareHierarchy;
  iconClassName?: string;
  className?: string;
};

export const Square = forwardRef<HTMLButtonElement, SquareProps>(function Square(
  { icon, label, color = 'default', hierarchy = 'primary', iconClassName, className, ...props },
  ref,
) {
  return (
    <AriaButton
      {...props}
      ref={ref}
      data-color={color}
      data-hierarchy={hierarchy}
      className={clsx(styles.squareButton, className)}
    >
      <span className={clsx(styles.squareButton__icon, iconClassName)}>{icon}</span>
      <span className={styles.squareButton__label}>{label}</span>
    </AriaButton>
  );
});
