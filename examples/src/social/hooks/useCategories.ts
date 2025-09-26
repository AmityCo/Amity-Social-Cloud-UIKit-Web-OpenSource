import useCategoriesCollection from '~/social/hooks/collections/useCategoriesCollection';

/**
 *
 * @deprecated use useCategoriesCollection instead
 */
const useCategories = (query: Amity.CategoryLiveCollection) => {
  const { categories, hasMore, loadMore } = useCategoriesCollection(query);

  return [categories, hasMore, loadMore];
};

export default useCategories;
