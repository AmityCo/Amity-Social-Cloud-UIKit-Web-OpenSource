import { CommunityRepository } from 'eko-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = (queryParams = {}) => {
  const [communities, hasMore, loadMore] = useLiveCollection(
    () => CommunityRepository.allCommunitiesWithFilters(queryParams),
    Object.values(queryParams),
  );

  return [communities, hasMore, loadMore];
};

export default useCommunitiesList;
