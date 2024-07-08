import React from 'react';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './DoneButton.module.css';

export interface DoneButtonProps {
  pageId?: string;
  componentId?: string;
  onPress?: ButtonProps['onPress'];
}

export function DoneButton({ pageId = '*', componentId = '*', onPress }: DoneButtonProps) {
  const elementId = 'done_button';
  const { accessibilityId, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button className={styles.doneButton} data-qa-anchor={accessibilityId} onPress={onPress}>
      <Typography.Body className={styles.doneButton_text}>
        {config.done_button_text}
      </Typography.Body>
    </Button>
  );
}
