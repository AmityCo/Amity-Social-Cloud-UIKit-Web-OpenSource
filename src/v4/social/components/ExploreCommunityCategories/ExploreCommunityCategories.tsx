import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import React, { Fragment, useEffect } from 'react';
import ChevronRight from '~/v4/icons/ChevronRight';
import { Carousel } from '~/v4/core/components/Carousel';
import { Button } from '~/v4/core/natives/Button/Button';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CategoryChip } from '~/v4/social/elements/CategoryChip/CategoryChip';
import { CategoryChipSkeleton } from '~/v4/social/elements/CategoryChip/CategoryChipSkeleton';
import styles from './ExploreCommunityCategories.module.css';

type ExploreCommunityCategoriesProps = {
  pageId?: string;
};

export const ExploreCommunityCategories = ({ pageId = '*' }: ExploreCommunityCategoriesProps) => {
  const componentId = 'explore_community_categories';

  const { categories, isCategoryLoading, fetchCommunityCategories } = useExplore();
  const { goToAllCategoriesPage, goToCommunitiesByCategoryPage } = useNavigation();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });

  useEffect(() => {
    fetchCommunityCategories();
  }, []);

  return (
    <Carousel
      scrollOffset={300}
      isHidden={isCategoryLoading || categories.length <= 3}
      className={styles.exploreCommunityCategories__carousel}
      iconClassName={styles.exploreCommunityCategories__arrowIcon}
      leftArrowClassName={clsx(styles.exploreCommunityCategories__arrow, styles.left)}
      rightArrowClassName={clsx(styles.exploreCommunityCategories__arrow, styles.right)}
    >
      <div
        style={themeStyles}
        data-testid={accessibilityId}
        className={styles.exploreCommunityCategories}
      >
        {isCategoryLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CategoryChipSkeleton key={index} />)
        ) : (
          <Fragment>
            {categories.slice(0, 5).map((category) => (
              <CategoryChip
                pageId={pageId}
                category={category}
                key={category.categoryId}
                onClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
              />
            ))}
            {categories.length >= 5 && (
              <Button
                onPress={() => goToAllCategoriesPage()}
                className={clsx(styles.exploreCommunityCategories__seeMore)}
              >
                <Typography.BodyBold>
                  {useString('amity_social_button_see_more')}
                </Typography.BodyBold>
                <ChevronRight className={styles.exploreCommunityCategories__seeMoreIcon} />
              </Button>
            )}
          </Fragment>
        )}
      </div>
    </Carousel>
  );
};
