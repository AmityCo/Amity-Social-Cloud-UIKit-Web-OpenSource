import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = (queryParams = {}, resolver = undefined) => {
  return useLiveCollection(
    () => CommunityRepository.getRecommendedCommunities(queryParams),
    Object.values(queryParams),
    resolver,
  );
};

export default useCommunitiesList;
