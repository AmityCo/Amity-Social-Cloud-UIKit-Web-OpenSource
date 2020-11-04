import { CommunityRepository } from 'eko-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCategories = query => {
  const [categories, hasMore, loadMore] = useLiveCollection(
    () => CommunityRepository.queryCategories(query),
    [],
  );

  return [categories, hasMore, loadMore];
};

export default useCategories;
