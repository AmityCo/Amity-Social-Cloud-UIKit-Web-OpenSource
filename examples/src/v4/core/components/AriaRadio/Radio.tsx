import clsx from 'clsx';
import React from 'react';
import { Radio as $Radio, RadioProps as $RadioProps } from 'react-aria-components';
import styles from './Radio.module.css';

export type RadioProps = $RadioProps & {
  label?: React.ReactNode;
};

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <$Radio {...props} className={clsx(styles.radio, className)}>
      {label}
    </$Radio>
  );
}
