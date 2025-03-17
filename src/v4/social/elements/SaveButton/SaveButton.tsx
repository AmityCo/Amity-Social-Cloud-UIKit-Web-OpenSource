import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './SaveButton.module.css';

import { Button } from '~/v4/core/natives/Button';
import clsx from 'clsx';

interface SaveButtonProps {
  pageId?: string;
  componentId?: string;
  className?: string;
  onPress?: () => void;
  isDisabled?: boolean;
}

export function SaveButton({
  pageId = '*',
  componentId = '*',
  onPress,
  className,
  isDisabled = false,
}: SaveButtonProps) {
  const elementId = 'save_button';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      style={themeStyles}
      className={clsx(styles.saveButton, className)}
      data-testid={accessibilityId}
      onPress={onPress}
      isDisabled={isDisabled}
    >
      {config.save_button_text}
    </Button>
  );
}
