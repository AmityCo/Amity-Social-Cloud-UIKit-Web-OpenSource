import useRecommendedCommunitiesCollection from '~/social/hooks/collections/useRecommendedCommunitiesCollection';

/**
 *
 * @deprecated use useRecommendedCommunitiesCollection instead
 */
const useRecommendedCommunitiesList = (params?: Amity.PageLimit) => {
  const { communities, hasMore, loadMore } = useRecommendedCommunitiesCollection(params);

  return [communities, hasMore, loadMore];
};

export default useRecommendedCommunitiesList;
