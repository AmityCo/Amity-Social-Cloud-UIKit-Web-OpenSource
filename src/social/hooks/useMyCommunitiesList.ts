import { CommunityRepository, CommunityFilter } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useMyCommunitiesList = () => {
  const params = {
    filter: CommunityFilter.Member,
    isDeleted: false,
  };

  const collection = useLiveCollection(
    () => CommunityRepository.allCommunitiesWithFilters(params),
    [CommunityFilter.Member],
  );

  return collection;
};

export default useMyCommunitiesList;
