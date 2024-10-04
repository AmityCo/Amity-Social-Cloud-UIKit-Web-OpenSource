import React from 'react';
import styles from './AllCategoriesTitle.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface AllCategoriesTitleProps {
  pageId?: string;
  componentId?: string;
}

export const AllCategoriesTitle = ({
  pageId = '*',
  componentId = '*',
}: AllCategoriesTitleProps) => {
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
      className={styles.communityName__truncate}
      style={themeStyles}
    >
      All Categories
    </Typography.Title>
  );
};
