import { CategoryRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useCategoriesCollection(query: Amity.CategoryLiveCollection) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CategoryRepository.getCategories,
    params: query,
  });

  return {
    categories: items,
    ...rest,
  };
}
