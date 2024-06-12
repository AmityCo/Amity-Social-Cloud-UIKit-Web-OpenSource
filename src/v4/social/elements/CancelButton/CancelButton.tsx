import { config } from 'process';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './CancelButton.module.css';

interface CancelButtonProps {
  pageId?: string;
  componentId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CancelButton = ({
  pageId = '*',
  componentId = '*',
  onClick = () => {},
}: CancelButtonProps) => {
  const elementId = 'cancel_button';
  const { accessibilityId, config, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <button data-qa-anchor={accessibilityId} style={themeStyles} onClick={onClick}>
      <Typography.Body className={styles.clearButton}>{config.text}</Typography.Body>
    </button>
  );
};
