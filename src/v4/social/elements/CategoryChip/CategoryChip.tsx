import React from 'react';
import styles from './CategoryChip.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import clsx from 'clsx';
import { CategoryImage } from '~/v4/social/internal-components/CategoryImage/CategoryImage';

interface CategoryChipProps {
  pageId: string;
  componentId?: string;
  category: Amity.Category;
  onClick?: (categoryId: string) => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  pageId = '*',
  componentId = '*',
  category,
  onClick,
}) => {
  const elementId = 'category_chip';

  const { isExcluded, accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const categoryImage = useImage({ fileId: category.avatar?.fileId });

  if (isExcluded) return null;

  return (
    <Button
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={styles.categoryChip}
      onPress={() => onClick?.(category.categoryId)}
    >
      <CategoryImage
        imgSrc={categoryImage}
        className={styles.categoryChip__image}
        pageId={pageId}
        componentId={componentId}
        elementId={elementId}
      />
      <Typography.BodyBold
        renderer={({ typoClassName }) => (
          <span className={clsx(typoClassName, styles.categoryChip__text)}>{category.name}</span>
        )}
      />
    </Button>
  );
};
