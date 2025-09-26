import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Divider.module.css';
import clsx from 'clsx';

type DividerProps = ComponentPropsWithoutRef<'div'> & {
  isShown?: boolean;
};

export function Divider({ isShown = true, className }: DividerProps) {
  return isShown ? <div className={clsx(styles.divider, className)} /> : null;
}
