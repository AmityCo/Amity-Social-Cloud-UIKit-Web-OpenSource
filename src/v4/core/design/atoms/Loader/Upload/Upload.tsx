import clsx from 'clsx';
import { forwardRef } from 'react';
import { Cross } from '~/v4/core/design/icons/Cross';
import styles from './Upload.module.css';

export type UploadSize = 'medium' | 'large';

export type UploadProps = {
  size?: UploadSize;
  progress?: number;
  onCancel?: () => void;
  className?: string;
  'aria-label'?: string;
};

const INDETERMINATE_ARC = 25;

export const Upload = forwardRef<HTMLDivElement, UploadProps>(function Upload(
  { size = 'medium', progress, onCancel, className, ...props },
  ref,
) {
  const label = props['aria-label'] ?? 'Loading';
  const isIndeterminate = progress === undefined;
  const value = isIndeterminate ? INDETERMINATE_ARC : Math.max(0, Math.min(100, progress));
  const showCountdown = size === 'large' && !onCancel && !isIndeterminate;
  return (
    <div
      ref={ref}
      className={clsx(styles.upload, className)}
      data-size={size}
      data-indeterminate={isIndeterminate ? 'true' : undefined}
      role="status"
      aria-label={label}
    >
      <svg className={styles.upload__ring} viewBox="0 0 40 40">
        <circle className={styles.upload__track} cx="20" cy="20" r="18" pathLength={100} />
        <circle
          className={styles.upload__arc}
          cx="20"
          cy="20"
          r="18"
          pathLength={100}
          strokeDasharray={`${value} 100`}
        />
      </svg>
      {onCancel ? (
        <button
          type="button"
          className={styles.upload__cancel}
          onClick={onCancel}
          aria-label="Cancel"
        >
          <Cross.Light className={styles.upload__cancelIcon} />
        </button>
      ) : showCountdown ? (
        <span className={styles.upload__countdown}>{Math.round(value)}</span>
      ) : null}
    </div>
  );
});
