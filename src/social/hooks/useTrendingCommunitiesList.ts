import useTrendingCommunitiesCollection from '~/social/hooks/collections/useTrendingCommunitiesCollection';

// TODO: breaking change

/**
 *
 * @deprecated use useTrendingCommunitiesCollection instead
 */
const useTrendingCommunitiesList = (params?: Amity.PageLimit) => {
  const { communities, hasMore, loadMore } = useTrendingCommunitiesCollection(params);

  return [communities, hasMore, loadMore];
};

export default useTrendingCommunitiesList;
