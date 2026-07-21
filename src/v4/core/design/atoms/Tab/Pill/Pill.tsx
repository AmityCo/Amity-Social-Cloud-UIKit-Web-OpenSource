import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import { Tab as AriaTab, type TabProps as AriaTabProps } from 'react-aria-components';
import styles from './Pill.module.css';

export type PillProps = Omit<AriaTabProps, 'children' | 'style'> & {
  label: ReactNode;
  loading?: boolean;
  className?: string;
};

export const Pill = forwardRef<HTMLDivElement, PillProps>(function Pill(
  { label, loading = false, className, isDisabled, ...props },
  ref,
) {
  return (
    <AriaTab
      {...props}
      ref={ref}
      className={clsx(styles.tab, className)}
      isDisabled={isDisabled || loading}
      data-loading={loading || undefined}
    >
      {loading ? (
        <span className={styles.tab__skeleton} />
      ) : (
        <span className={styles.tab__label}>{label}</span>
      )}
    </AriaTab>
  );
});
