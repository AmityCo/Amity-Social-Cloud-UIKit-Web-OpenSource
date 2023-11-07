import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = (queryParams = {}, isDeleted = false, resolver = undefined) => {
  const params = {
    ...queryParams,
    isDeleted,
  };

  return useLiveCollection(
    () => CommunityRepository.allCommunitiesWithFilters(params),
    Object.values(queryParams),
    resolver,
  );
};

export default useCommunitiesList;
