import clsx from 'clsx';
import React from 'react';
import useCategoriesByIds from '~/v4/social/hooks/useCategoriesByIds';
import { CommunityCategory } from '~/v4/social/elements/CommunityCategory/CommunityCategory';
import styles from './CommunityCategories.module.css';

type CommunityCategoriesProps = {
  pageId?: string;
  truncate?: boolean;
  className?: string;
  componentId?: string;
  community: Amity.Community;
  maxCategoriesLength?: number;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  onClick?: (categoryId: string) => void;
};

export const CommunityCategories = ({
  onClick,
  community,
  className,
  pageId = '*',
  componentId = '*',
  truncate = false,
  maxCategoriesLength,
  maxCategoryCharacters,
  minCategoryCharacters,
}: CommunityCategoriesProps) => {
  const categories = useCategoriesByIds(community.categoryIds);

  const overflowCategoriesLength =
    typeof maxCategoriesLength === 'number' ? categories.length - maxCategoriesLength : 0;

  const categoriesLength =
    typeof maxCategoriesLength === 'number'
      ? Math.min(categories.length, maxCategoriesLength)
      : categories.length;

  if (categories.length === 0) return null;

  return (
    <div
      className={clsx(styles.communityCategories, className)}
      style={
        {
          '--asc-community-categories-length':
            overflowCategoriesLength > 0 ? categoriesLength + 1 : categoriesLength,
        } as React.CSSProperties
      }
    >
      {categories.slice(0, categoriesLength).map((category) => (
        <CommunityCategory
          pageId={pageId}
          truncate={truncate}
          key={category.categoryId}
          componentId={componentId}
          categoryName={category.name}
          minCharacters={minCategoryCharacters}
          maxCharacters={maxCategoryCharacters}
          onClick={() => onClick?.(category.categoryId)}
          className={styles.communityCategories__categoryChip}
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
