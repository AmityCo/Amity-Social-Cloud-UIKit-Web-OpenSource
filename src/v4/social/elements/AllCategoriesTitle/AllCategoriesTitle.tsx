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
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      data-testid={accessibilityId}
      className={styles.communityName__truncate}
      style={themeStyles}
    >
      {resolveText('amity_social_button_all_categories')}
    </Typography.TitleBold>
  );
};
