import { CommunityRepository } from 'eko-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCategories = query => {
  const [categories, categoriesHasMore, categoriesLoadMore] = useLiveCollection(
    () => CommunityRepository.queryCategories(query),
    [],
  );

  return {
    categories,
    categoriesHasMore,
    categoriesLoadMore,
  };
};

export default useCategories;
