import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Label.module.css';
import { presetSlug, type BadgeBaseProps } from '~/v4/core/design/atoms/Badge/types';

export type LabelProps = BadgeBaseProps & {
  label: string;
};

export const Label = forwardRef<HTMLSpanElement, LabelProps>(function Label(
  { label, shape = 'round', fill = 'filled', size = 24, border = false, preset, className },
  ref,
) {
  return (
    <span
      ref={ref}
      className={clsx(styles.badge, className)}
      data-variant="label"
      data-shape={shape}
      data-fill={fill}
      data-size={size}
      data-border={border || undefined}
      data-preset={presetSlug(preset)}
    >
      <span className={styles.badge__label}>{label}</span>
    </span>
  );
});
