import React from 'react';
import styles from './Title.module.css';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Typography } from '~/v4/core/components';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface TitleProps {
  pageId?: string;
  componentId?: string;
}

export function Title({ pageId = '*', componentId = '*' }: TitleProps) {
  const elementId = 'title';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Typography.Title className={styles.title} style={themeStyles} data-qa-anchor={accessibilityId}>
      {config.text}
    </Typography.Title>
  );
}
