import React, { useMemo } from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

import useCategories from '~/social/hooks/useCategories';
import { useNavigation } from '~/social/providers/NavigationProvider';
import HorizontalList from '~/core/components/HorizontalList';
import { UICategoryCard } from '~/social/components/community/CategoryCard';
import { isLoadingItem } from '~/utils';
import useCategoriesCollection from '~/social/hooks/collections/useCategoriesCollection';

const StyledUICategoryCard = styled(UICategoryCard)`
  > :first-child {
    padding-right: 1rem;
    padding-left: 0;
  }

  > :last-child {
    padding-left: 1rem;
    padding-right: 0;
  }

  padding-left: 1rem;
  padding-right: 1rem;
`;

const List = () => {
  const { onClickCategory } = useNavigation();
  const { categories, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } =
    useCategoriesCollection({
      includeDeleted: false,
    });

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(6).fill(1).map((x, index) => ({ categoryId: index, skeleton: true }));
    }

    if (isLoading) {
      return getLoadingItems();
    }

    if (!loadMoreHasBeenCalled) {
      return categories;
    }

    return [...categories, ...getLoadingItems()];
  }, [categories, isLoading, loadMoreHasBeenCalled]);

  return (
    <HorizontalList
      columns={{
        720: 2,
        1024: 3,
        1280: 5,
        1440: 6,
        1800: 8,
      }}
      title={<FormattedMessage id="categoryList" />}
      hasMore={hasMore}
      loadMore={loadMore}
    >
      {items.map((item) =>
        isLoadingItem(item) ? (
          <StyledUICategoryCard key={item.categoryId} loading />
        ) : (
          <StyledUICategoryCard
            key={item.categoryId}
            categoryId={item.categoryId}
            name={item.name}
            avatarFileId={item.avatarFileId}
            onClick={onClickCategory}
          />
        ),
      )}
    </HorizontalList>
  );
};

export default List;
