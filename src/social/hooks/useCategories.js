import { CommunityRepository } from 'eko-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCategories = () => {
  const [categories, categoriesHasMore, categoriesLoadMore] = useLiveCollection(
    () => CommunityRepository.queryCategories(),
    [],
  );

  return {
    categories,
    categoriesHasMore,
    categoriesLoadMore,
  };
};

export default useCategories;
