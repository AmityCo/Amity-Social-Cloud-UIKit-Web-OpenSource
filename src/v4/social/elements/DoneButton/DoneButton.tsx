import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './DoneButton.module.css';

export interface ExploreButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export function DoneButton({ pageId = '*', componentId = '*', onClick }: ExploreButtonProps) {
  const elementId = 'done_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <button data-qa-anchor={accessibilityId} style={themeStyles} onClick={onClick}>
      <Typography.Body className={styles.doneButton_text}>
        {config.done_button_text}
      </Typography.Body>
    </button>
  );
}
