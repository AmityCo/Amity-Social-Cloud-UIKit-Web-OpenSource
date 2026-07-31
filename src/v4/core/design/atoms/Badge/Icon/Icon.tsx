import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import styles from './Icon.module.css';
import { presetSlug, type BadgeBaseProps } from '~/v4/core/design/atoms/Badge/types';

export type IconProps = BadgeBaseProps & {
  icon: ReactNode;
  iconClassName?: string;
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    icon,
    iconClassName,
    shape = 'round',
    fill = 'filled',
    size = 24,
    border = false,
    preset,
    className,
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={clsx(styles.badge, className)}
      data-variant="icon"
      data-shape={shape}
      data-fill={fill}
      data-size={size}
      data-border={border || undefined}
      data-preset={presetSlug(preset)}
    >
      <span className={clsx(styles.badge__icon, iconClassName)}>{icon}</span>
    </span>
  );
});
