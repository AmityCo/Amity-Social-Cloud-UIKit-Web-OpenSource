import React from 'react';
import styles from './CommunityCategory.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';

interface CommunityCategoryProps {
  pageId?: string;
  componentId?: string;
  categoryName: string;
  minCharacters?: number;
  maxCharacters?: number;
  truncate?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CommunityCategory = ({
  pageId = '*',
  componentId = '*',
  categoryName,
  minCharacters,
  maxCharacters,
  truncate = false,
  className,
  onClick,
}: CommunityCategoryProps) => {
  const elementId = 'community_category';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const categoryNameLength = categoryName.length;

  return (
    <Button
      style={
        {
          ...themeStyles,
          '--asc-community-category-min-characters':
            minCharacters && categoryNameLength > minCharacters
              ? `${Math.min(minCharacters, categoryName.length)}ch`
              : undefined,
          '--asc-community-category-max-characters': maxCharacters
            ? `${maxCharacters}ch`
            : undefined,
        } as React.CSSProperties
      }
      data-testid={accessibilityId}
      data-truncated={categoryNameLength > (minCharacters ?? 0) ? truncate : false}
      className={clsx(styles.communityCategory, className)}
      onPress={() => onClick?.()}
    >
      <Typography.Caption>{categoryName}</Typography.Caption>
    </Button>
  );
};
