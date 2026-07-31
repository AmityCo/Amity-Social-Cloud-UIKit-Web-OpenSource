import clsx from 'clsx';
import React, { forwardRef } from 'react';
import styles from './Divider.module.css';

export type DividerVariant = 'content' | 'post';
export type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = {
  variant?: DividerVariant;
  orientation?: DividerOrientation;
  inset?: boolean;
  label?: string;
  className?: string;
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { variant = 'post', orientation = 'horizontal', inset, label, className },
  ref,
) {
  const resolvedInset = inset ?? variant === 'content';

  if (label) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={clsx(styles.divider, styles.dividerLabeled, className)}
        data-variant={variant}
        data-orientation={orientation}
      >
        <span className={styles.divider__line} />
        <span className={styles.divider__label}>{label}</span>
        <span className={styles.divider__line} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={clsx(styles.divider, className)}
      data-variant={variant}
      data-orientation={orientation}
      data-inset={resolvedInset || undefined}
    />
  );
});
