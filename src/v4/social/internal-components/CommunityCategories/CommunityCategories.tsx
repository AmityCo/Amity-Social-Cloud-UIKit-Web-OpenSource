import React from 'react';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';

import styles from './CommunityCategories.module.css';
import { CommunityCategory } from '~/v4/social/elements/CommunityCategory/CommunityCategory';
import clsx from 'clsx';

export const CommunityCategories = ({
  community,
  pageId = '*',
  componentId = '*',
  onClick,
  minCategoryCharacters,
  maxCategoryCharacters,
  maxCategoriesLength,
  truncate = false,
}: {
  community: Amity.Community;
  pageId?: string;
  componentId?: string;
  onClick?: (categoryId: string) => void;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  maxCategoriesLength?: number;
  truncate?: boolean;
}) => {
  const categories = useCategoriesByIds(community.categoryIds);

  const overflowCategoriesLength =
    typeof maxCategoriesLength === 'number' ? categories.length - maxCategoriesLength : 0;

  const categoriesLength =
    typeof maxCategoriesLength === 'number'
      ? Math.min(categories.length, maxCategoriesLength)
      : categories.length;

  return (
    <div
      className={styles.communityCategories}
      style={
        {
          '--asc-community-categories-length':
            overflowCategoriesLength > 0 ? categoriesLength + 1 : categoriesLength,
        } as React.CSSProperties
      }
    >
      {categories.slice(0, categoriesLength).map((category) => (
        <CommunityCategory
          key={category.categoryId}
          pageId={pageId}
          componentId={componentId}
          categoryName={category.name}
          minCharacters={minCategoryCharacters}
          maxCharacters={maxCategoryCharacters}
          truncate={truncate}
          className={styles.communityCategories__categoryChip}
          onClick={() => onClick?.(category.categoryId)}
        />
      ))}
      {overflowCategoriesLength > 0 && (
        <CommunityCategory
          pageId={pageId}
          componentId={componentId}
          categoryName={`+${overflowCategoriesLength}`}
          minCharacters={`+${overflowCategoriesLength}`.length}
          className={clsx(
            styles.communityCategories__categoryChip,
            styles.communityCategories__categoryOverflow,
          )}
        />
      )}
    </div>
  );
};
