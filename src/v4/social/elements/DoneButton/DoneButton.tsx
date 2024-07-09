import React from 'react';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './DoneButton.module.css';

export interface DoneButtonProps extends ButtonProps {
  pageId?: string;
  componentId?: string;
  formId?: string;
}

export function DoneButton({
  pageId = '*',
  componentId = '*',
  className,
  ...buttonProps
}: DoneButtonProps) {
  const elementId = 'done_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      className={`${styles.doneButton} ${className || ''}`}
      data-qa-anchor={accessibilityId}
      {...buttonProps}
    >
      <Typography.Body className={styles.doneButton_text}>
        {config.done_button_text}
      </Typography.Body>
    </Button>
  );
}
