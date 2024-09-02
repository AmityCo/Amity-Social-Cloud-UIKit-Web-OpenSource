import React from 'react';
import styles from './CommunityCategoryName.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

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
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
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
