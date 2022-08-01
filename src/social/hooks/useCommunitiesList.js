import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = (queryParams = {}, isDeleted = false, resolver = undefined) => {
  const params = {
    ...queryParams,
    isDeleted,
  };

  const collection = useLiveCollection(
    () => CommunityRepository.allCommunitiesWithFilters(params),
    Object.values(queryParams),
    resolver,
  );

  return collection;
};

export default useCommunitiesList;
