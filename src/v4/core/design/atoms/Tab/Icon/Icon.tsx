import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import { Tab as AriaTab, type TabProps as AriaTabProps } from 'react-aria-components';
import styles from './Icon.module.css';

export type IconProps = Omit<AriaTabProps, 'children' | 'style'> & {
  icon: ReactNode;
  iconClassName?: string;
  className?: string;
};

export const Icon = forwardRef<HTMLDivElement, IconProps>(function Icon(
  { icon, iconClassName, className, ...props },
  ref,
) {
  return (
    <AriaTab {...props} ref={ref} className={clsx(styles.tab, className)}>
      <span className={clsx(styles.tab__icon, iconClassName)}>{icon}</span>
      <span className={styles.tab__indicator} />
    </AriaTab>
  );
});
