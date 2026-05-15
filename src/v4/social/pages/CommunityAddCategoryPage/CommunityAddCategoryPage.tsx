import React, { useEffect, useState } from 'react';
import { useString } from '~/v4/core/localization';
import styles from './CommunityAddCategoryPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Avatar, Typography } from '~/v4/core/components';
import { CheckboxGroup } from 'react-aria-components';
import useCategoriesCollection from '~/v4/social/hooks/useCategoriesCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { Checkbox as CheckboxIcon } from '~/v4/icons/Checkbox';
import { Category } from '~/v4/icons/Category';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button } from '~/v4/core/components/AriaButton';

interface CommunityAddCategoryPageProps {
  category?: Amity.Category[];
}

export const CommunityAddCategoryPage = ({ category }: CommunityAddCategoryPageProps) => {
  const pageId = 'community_add_category_page';
  const { isDesktop } = useResponsive();
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const {
    categories: allCategories,
    hasMore,
    loadMore,
    isLoading,
  } = useCategoriesCollection({
    limit: 10,
    sortBy: 'name',
  });
  const { categories, setCategories } = useCommunitySetupContext();
  const [selectedCategories, setSelectedCategories] = useState<Amity.Category[]>(categories || []);
  const MAX_CATEGORIES = 10;

  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  const { onBack } = useNavigation();

  const handleClosePage = () => {
    onBack();
  };

  const handleSelectCategory = (category: Amity.Category, isChecked: boolean) => {
    if (isChecked) {
      if (selectedCategories.length < MAX_CATEGORIES) {
        setSelectedCategories((selectedCategories) => {
          const updatedCategories = [...selectedCategories, category];
          if (isDesktop) {
            setCategories(updatedCategories);
            return updatedCategories;
          }
          return updatedCategories;
        });
      }
    } else {
      setSelectedCategories((selectedCategories) => {
        const updatedCategories = selectedCategories.filter(
          (c) => c.categoryId !== category.categoryId,
        );
        if (isDesktop) {
          setCategories(updatedCategories);
          return updatedCategories;
        }
        return updatedCategories;
      });
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c.categoryId !== categoryId));
  };

  const handleAddCategory = () => {
    setCategories(selectedCategories);
    onBack();
  };

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityAddCategoryPage__container}
    >
      <div className={styles.communityAddCategoryPage__topMenuSticky}>
        <div className={styles.communityAddCategoryPage__navbar}>
          <CloseButton pageId={pageId} onPress={() => handleClosePage()} />
          <Typography.TitleBold>
            {useString('amity_social_button_community_setup_categories_description')}
          </Typography.TitleBold>
          <Typography.Body className={styles.communityAddCategoryPage__categoryCount}>
            {selectedCategories.length}/{MAX_CATEGORIES}
          </Typography.Body>
        </div>
        {selectedCategories.length > 0 && (
          <div className={styles.communityAddCategoryPage__topMenuWrap}>
            <div className={styles.communityAddCategoryPage__selectedCategoryWrap}>
              {selectedCategories.map((category) => (
                <div
                  key={category.categoryId}
                  className={styles.communityAddCategoryPage__selectedCategory}
                >
                  <div className={styles.communityAddCategoryPage__selectedCategoryTagAvatar}>
                    <Avatar
                      avatarUrl={category.avatar?.fileUrl}
                      defaultImage={
                        <Category
                          className={styles.communityAddCategoryPage__categorySelectedAvatarDefault}
                        />
                      }
                      imgClassName={styles.communityAddCategoryPage__selectedCategoryTagAvatar}
                    />
                  </div>

                  <Typography.Body
                    className={styles.communityAddCategoryPage__selectedCategoryName}
                  >
                    {category.name}
                  </Typography.Body>

                  <CloseButton
                    pageId={pageId}
                    onPress={() => handleRemoveCategory(category.categoryId)}
                    defaultClassName={styles.communityAddCategoryPage__removeCategory}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.communityAddCategoryPage__categoryList}>
        <CheckboxGroup
          data-testid={`${pageId}/*/add-category-selection`}
          className={styles.checkbox__group}
        >
          {allCategories.map((category, index) => (
            <div
              data-testid={`${pageId}/*/category-item-${index}`}
              className={styles.checkbox__item}
              key={category.categoryId}
            >
              <label
                htmlFor={category.categoryId}
                className={styles.communityAddCategoryPage__categoryItem}
                data-testid={`${pageId}/*/category-item-${category.name}`}
              >
                <div className={styles.communityAddCategoryPage__leftSide}>
                  <div className={styles.communityAddCategoryPage__categoryAvatar}>
                    <Avatar
                      imgClassName={styles.communityAddCategoryPage__categoryAvatarDefault}
                      containerClassName={styles.communityAddCategoryPage__categoryAvatarDefault}
                      avatarUrl={category.avatar?.fileUrl}
                      defaultImage={
                        <Category
                          className={styles.communityAddCategoryPage__categoryAvatarDefault}
                        />
                      }
                    />
                  </div>
                  <Typography.BodyBold
                    testId={`${pageId}/*/category-item-${category.name}`}
                    className={styles.communityAddCategoryPage__categoryName}
                  >
                    {category.name}
                  </Typography.BodyBold>
                </div>
                <input
                  className={styles.communityAddCategoryPage__inputCheckbox}
                  type="checkbox"
                  id={category.categoryId}
                  checked={!!selectedCategories.find((c) => c.categoryId === category.categoryId)}
                  onChange={(e) => handleSelectCategory(category, e.target.checked)}
                />
                <div aria-hidden="true">
                  <CheckboxIcon className={styles.communityAddCategoryPage__checkboxIcon} />
                </div>
              </label>
            </div>
          ))}
        </CheckboxGroup>
        <div ref={(node) => setIntersectionNode(node)} />
      </div>
      <div className={styles.communityAddCategoryPage__addCategoryButton}>
        <Button
          size="medium"
          type="button"
          variant="fill"
          color="primary"
          onPress={handleAddCategory}
          isDisabled={selectedCategories.length === 0}
          data-testid={`${pageId}/*/add_category_button`}
          className={styles.communityAddCategoryPage__button}
        >
          {useString('amity_social_button_add_category')}
        </Button>
      </div>
    </div>
  );
};
