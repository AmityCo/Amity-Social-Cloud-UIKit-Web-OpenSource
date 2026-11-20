import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'lg';

// `media` sits on a video frame: a white quarter arc with no track.
export type SpinnerVariant = 'default' | 'media';

export type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  'aria-label'?: string;
};

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { size = 'lg', variant = 'default', className, ...props },
  ref,
) {
  const label = props['aria-label'] ?? 'Loading';
  const radius = variant === 'media' ? 19 : 16;
  return (
    <svg
      ref={ref}
      className={clsx(styles.spinner, className)}
      data-size={size}
      data-variant={variant}
      viewBox="0 0 40 40"
      role="status"
      aria-label={label}
    >
      {variant === 'default' && (
        <circle className={styles.spinner__track} cx="20" cy="20" r={radius} pathLength={100} />
      )}
      <circle className={styles.spinner__arc} cx="20" cy="20" r={radius} pathLength={100} />
    </svg>
  );
});
