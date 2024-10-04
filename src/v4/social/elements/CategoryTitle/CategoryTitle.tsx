import React from 'react';
import styles from './CategoryTitle.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CategoryTitleProps {
  pageId?: string;
  componentId?: string;
  categoryName: string;
}

export const CategoryTitle = ({
  pageId = '*',
  componentId = '*',
  categoryName,
}: CategoryTitleProps) => {
  const elementId = 'all_categories_title';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Title
      data-qa-anchor={accessibilityId}
      className={styles.categoryTitle}
      style={themeStyles}
    >
      {categoryName}
    </Typography.Title>
  );
};
