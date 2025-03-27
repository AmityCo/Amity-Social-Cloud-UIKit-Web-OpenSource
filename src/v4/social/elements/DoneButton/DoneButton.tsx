import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './DoneButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/components/AriaButton';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export interface DoneButtonProps extends React.ComponentProps<typeof Button> {
  pageId?: string;
  componentId?: string;
  className?: string;
  isDisabled?: boolean;
}

export function DoneButton({
  pageId = '*',
  componentId = '*',
  className,
  isDisabled = false,

  ...buttonProps
}: DoneButtonProps) {
  const elementId = 'done_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  const { isDesktop } = useResponsive();

  if (isExcluded) return null;

  return (
    <Button
      variant={isDesktop ? 'fill' : 'text'}
      className={clsx(styles.doneButton, className)}
      data-testid={accessibilityId}
      isDisabled={isDisabled}
      {...buttonProps}
    >
      <Typography.Body>{config.done_button_text}</Typography.Body>
    </Button>
  );
}
