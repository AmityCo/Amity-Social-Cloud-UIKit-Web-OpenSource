import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Radio as AriaRadio, type RadioProps as AriaRadioProps } from 'react-aria-components';
import styles from './Radio.module.css';

export type RadioProps = Omit<AriaRadioProps, 'children' | 'style'> & {
  className?: string;
  children?: React.ReactNode;
};

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(
  { className, children, ...props },
  ref,
) {
  return (
    <AriaRadio
      {...props}
      ref={ref}
      data-layout={children != null ? 'row' : undefined}
      className={clsx(styles.selection, className)}
    >
      {children}
      <span className={styles.selection__circle}>
        <span className={styles.selection__dot} />
      </span>
    </AriaRadio>
  );
});
