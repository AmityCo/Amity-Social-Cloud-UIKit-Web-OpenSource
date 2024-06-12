import React from 'react';
import styles from './HeaderLabel.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

export interface HeaderLabelProps {
  pageId?: string;
  componentId?: string;
}

export function HeaderLabel({ pageId = '*', componentId = '*' }: HeaderLabelProps) {
  const elementId = 'header_label';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Typography.Heading
      className={styles.headerLabel}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {config.text}
    </Typography.Heading>
  );
}
