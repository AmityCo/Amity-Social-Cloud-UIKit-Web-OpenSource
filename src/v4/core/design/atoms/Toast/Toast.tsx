import clsx from 'clsx';
import { forwardRef } from 'react';
import { CheckCircle } from '~/v4/core/design/icons/CheckCircle';
import { ExclamationCircle } from '~/v4/core/design/icons/ExclamationCircle';
import { InfoCircle } from '~/v4/core/design/icons/InfoCircle';
import { Loader } from '~/v4/core/design/atoms/Loader';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'informative' | 'loading';

export type ToastProps = {
  message: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  className?: string;
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { message, variant = 'informative', showIcon = true, className },
  ref,
) {
  const leading = !showIcon ? null : variant === 'loading' ? (
    <Loader.Spinner size="sm" className={styles.toast__spinner} aria-label="Loading" />
  ) : variant === 'success' ? (
    <CheckCircle className={styles.toast__icon} />
  ) : variant === 'error' ? (
    <ExclamationCircle className={styles.toast__icon} />
  ) : (
    <InfoCircle className={styles.toast__icon} />
  );

  return (
    <div ref={ref} role="status" aria-live="polite" className={clsx(styles.toast, className)}>
      {leading}
      <span className={styles.toast__message}>{message}</span>
    </div>
  );
});
