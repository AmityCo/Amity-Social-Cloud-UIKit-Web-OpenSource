import React from 'react';
import styles from './Description.module.css';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Typography } from '~/v4/core/components';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface DescriptionProps {
  pageId?: string;
  componentId?: string;
}

export function Description({ pageId = '*', componentId = '*' }: DescriptionProps) {
  const elementId = 'description';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Typography.Caption
      className={styles.description}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Caption>
  );
}
