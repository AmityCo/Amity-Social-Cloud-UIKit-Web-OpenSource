import React, { useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import useCategories from '~/social/hooks/useCategories';
import { useNavigation } from '~/social/providers/NavigationProvider';
import HorizontalList from '~/core/components/HorizontalList';
import CommunityCategoryCard from '~/social/components/community/CategoryCard';

const List = () => {
  const { onClickCategory } = useNavigation();
  const [categories, hasMore, loadMore, loading, loadingMore] = useCategories({ isDeleted: false });

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(6).fill(1).map((x, index) => ({ categoryId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return categories;
    }

    return [...categories, ...getLoadingItems()];
  }, [categories, loading, loadingMore]);

  return (
    <HorizontalList
      columns={{
        1024: 3,
        1280: 5,
        1440: 6,
        1800: 8,
      }}
      title={<FormattedMessage id="categoryList" />}
      hasMore={hasMore}
      loadMore={loadMore}
    >
      {items.map(({ categoryId, skeleton }) =>
        skeleton ? (
          <CommunityCategoryCard key={categoryId} loading />
        ) : (
          <CommunityCategoryCard
            key={categoryId}
            categoryId={categoryId}
            onClick={onClickCategory}
          />
        ),
      )}
    </HorizontalList>
  );
};

export default List;
