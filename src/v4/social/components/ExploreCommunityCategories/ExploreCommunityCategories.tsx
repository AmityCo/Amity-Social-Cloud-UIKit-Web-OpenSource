import React, { useEffect, useRef } from 'react';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CategoryChip } from '~/v4/social/elements/CategoryChip/CategoryChip';
import { Typography } from '~/v4/core/components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button/Button';
import clsx from 'clsx';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { CategoryChipSkeleton } from '~/v4/social/elements/CategoryChip/CategoryChipSkeleton';

import styles from './ExploreCommunityCategories.module.css';
import ChevronRight from '~/v4/icons/ChevronRight';

interface ExploreCommunityCategoriesProps {
  pageId?: string;
}

export const ExploreCommunityCategories = ({ pageId = '*' }: ExploreCommunityCategoriesProps) => {
  const componentId = 'explore_community_categories';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { goToAllCategoriesPage, goToCommunitiesByCategoryPage } = useNavigation();

  const { categories, isLoading, fetchCommunityCategories } = useExplore();

  useEffect(() => {
    fetchCommunityCategories();
  }, []);

  const intersectionRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    node: intersectionRef.current,
    onIntersect: () => {},
  });

  if (isLoading) {
    return (
      <div
        className={styles.exploreCommunityCategories}
        style={themeStyles}
        data-qa-anchor={accessibilityId}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <CategoryChipSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={styles.exploreCommunityCategories}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {categories.map((category) => (
        <div className={styles.exploreCommunityCategories__categoryChip} key={category.categoryId}>
          <CategoryChip
            pageId={pageId}
            category={category}
            onClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
          />
        </div>
      ))}

      {categories.length >= 5 ? (
        <Typography.BodyBold
          renderer={({ typoClassName }) => (
            <Button
              className={clsx(typoClassName, styles.exploreCommunityCategories__seeMore)}
              onPress={() => goToAllCategoriesPage()}
            >
              <div>See more</div>
              <ChevronRight className={styles.exploreCommunityCategories__seeMoreIcon} />
            </Button>
          )}
        />
      ) : null}
    </div>
  );
};
