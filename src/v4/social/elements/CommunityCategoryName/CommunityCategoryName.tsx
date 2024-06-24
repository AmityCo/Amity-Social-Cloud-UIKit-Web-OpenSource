import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import styles from './CommunityCategoryName.module.css';

export interface CommunityCategoryNameProps {
  pageId?: string;
  componentId?: string;
  categoryName: string;
}

export function CommunityCategoryName({
  pageId = '*',
  componentId = '*',
  categoryName,
}: CommunityCategoryNameProps) {
  const elementId = 'community_category_name';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div
      className={styles.communityCategoryName}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      <Typography.Caption>{categoryName}</Typography.Caption>
    </div>
  );
}
