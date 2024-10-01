import React, { useState } from 'react';
import styles from './AllCategoriesPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import useCategoriesCollection from '~/v4/core/hooks/collections/useCategoriesCollection';
import useImage from '~/core/hooks/useImage';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { AllCategoriesTitle } from '~/v4/social/elements/AllCategoriesTitle';
import ChevronRight from '~/v4/icons/ChevronRight';
import { CategoryImage } from '~/v4/social/internal-components/CategoryImage';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

interface AllCategoryItemProps {
  category: Amity.Category;
  pageId: string;
  onClick: (categoryId: string) => void;
}

const AllCategoryItem = ({ category, pageId, onClick }: AllCategoryItemProps) => {
  const avatarImg = useImage({
    fileId: category.avatarFileId,
    imageSize: 'small',
  });

  return (
    <Button className={styles.allCategoryItem} onPress={() => onClick(category.categoryId)}>
      <CategoryImage imgSrc={avatarImg} className={styles.allCategoryItem__image} pageId={pageId} />
      <Typography.BodyBold className={styles.allCategoryItem__categoryName}>
        {category.name}
      </Typography.BodyBold>
      <ChevronRight className={styles.allCategoryItem__arrow} />
    </Button>
  );
};

export function AllCategoriesPage() {
  const pageId = 'all_categories_page';

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { goToCommunitiesByCategoryPage, onBack } = useNavigation();

  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });

  const { categories, isLoading, error, loadMore, hasMore } = useCategoriesCollection({
    query: { limit: 20 },
  });

  useIntersectionObserver({
    node: intersectionNode,
    options: {
      threshold: 0.8,
    },
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  return (
    <div className={styles.allCategoriesPage} style={themeStyles} data-qa-anchor={accessibilityId}>
      <div className={styles.allCategoriesPage__navigation}>
        <BackButton pageId={pageId} onPress={onBack} />
        <AllCategoriesTitle pageId={pageId} />
      </div>
      <div className={styles.allCategoriesList}>
        {categories.map((category, index) => (
          <React.Fragment key={category.categoryId}>
            <AllCategoryItem
              category={category}
              pageId={pageId}
              onClick={(categoryId) => {
                goToCommunitiesByCategoryPage({
                  categoryId,
                });
              }}
            />
            {index < categories.length - 1 && <div className={styles.allCategoriesList__divider} />}
          </React.Fragment>
        ))}
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.allCategoriesList__intersectionNode}
        />
      </div>
    </div>
  );
}
