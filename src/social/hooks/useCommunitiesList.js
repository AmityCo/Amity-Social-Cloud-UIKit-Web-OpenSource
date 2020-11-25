import { CommunityRepository } from 'eko-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = (queryParams = {}, isDeleted = false) => {
  const params = {
    ...queryParams,
    isDeleted,
  };
  const [communities, hasMore, loadMore] = useLiveCollection(
    () => CommunityRepository.allCommunitiesWithFilters(params),
    Object.values(queryParams),
  );

  return [communities, hasMore, loadMore];
};

export default useCommunitiesList;
