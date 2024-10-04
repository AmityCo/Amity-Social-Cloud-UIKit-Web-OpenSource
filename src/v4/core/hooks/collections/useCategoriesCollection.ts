import { CategoryRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useCategoriesCollection({
  query,
  enabled,
}: {
  query: Amity.CategoryLiveCollection;
  enabled?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CategoryRepository.getCategories,
    params: query,
    shouldCall: enabled,
  });

  return {
    categories: items,
    ...rest,
  };
}
