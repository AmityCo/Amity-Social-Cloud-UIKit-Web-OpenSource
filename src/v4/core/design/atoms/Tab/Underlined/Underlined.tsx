import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import { Tab as AriaTab, type TabProps as AriaTabProps } from 'react-aria-components';
import styles from './Underlined.module.css';

export type UnderlinedProps = Omit<AriaTabProps, 'children' | 'style'> & {
  label: ReactNode;
  className?: string;
};

export const Underlined = forwardRef<HTMLDivElement, UnderlinedProps>(function Underlined(
  { label, className, ...props },
  ref,
) {
  return (
    <AriaTab {...props} ref={ref} className={clsx(styles.tab, className)}>
      <span className={styles.tab__label}>{label}</span>
      <span className={styles.tab__indicator} />
    </AriaTab>
  );
});
