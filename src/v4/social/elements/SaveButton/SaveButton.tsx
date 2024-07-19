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
}

export function SaveButton({
  pageId = '*',
  componentId = '*',
  onPress,
  className,
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
      className={clsx(styles.saveButton, className)}
      data-qa-anchor={accessibilityId}
      style={{ ...themeStyles, backgroundColor: config.background_color as string | undefined }}
      onPress={onPress}
    >
      {config.save_button_text}
    </Button>
  );
}
