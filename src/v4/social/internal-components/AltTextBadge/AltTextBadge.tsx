import clsx from 'clsx';
import React from 'react';
import Check from '~/v4/icons/Check';
import { Typography } from '~/v4/core/components';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './AltTextBadge.module.css';

type AltTextBadgeProps = ButtonProps & {
  completed?: boolean;
};

export function AltTextBadge({ className, completed, ...props }: AltTextBadgeProps) {
  return (
    <Button
      {...props}
      data-completed={completed}
      aria-label="Add alternative text to your image"
      className={clsx(styles.altTextBadge, className)}
    >
      <Typography.CaptionBold className={styles.altTextBadge__text}>ALT</Typography.CaptionBold>
      <Check className={styles.altTextBadge__icon} />
    </Button>
  );
}
