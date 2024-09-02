import React from 'react';
import styles from './CommunityCategory.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityCategoryName } from '~/v4/social/elements/CommunityCategoryName';

interface CommunityCategoryProps {
  categories: Amity.Category[];
  pageId?: string;
  componentId?: string;
}

export const CommunityCategory = ({
  pageId = '*',
  componentId = '*',
  categories,
}: CommunityCategoryProps) => {
  const elementId = 'community_category';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.community__category}
    >
      {categories.map((category) => (
        <CommunityCategoryName categoryName={category.name} />
      ))}
    </div>
  );
};
