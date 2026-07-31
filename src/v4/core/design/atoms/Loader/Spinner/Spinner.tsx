import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'lg';

export type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  'aria-label'?: string;
};

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { size = 'lg', className, ...props },
  ref,
) {
  const label = props['aria-label'] ?? 'Loading';
  return (
    <svg
      ref={ref}
      className={clsx(styles.spinner, className)}
      data-size={size}
      viewBox="0 0 40 40"
      role="status"
      aria-label={label}
    >
      <circle className={styles.spinner__track} cx="20" cy="20" r="16" pathLength={100} />
      <circle className={styles.spinner__arc} cx="20" cy="20" r="16" pathLength={100} />
    </svg>
  );
});
