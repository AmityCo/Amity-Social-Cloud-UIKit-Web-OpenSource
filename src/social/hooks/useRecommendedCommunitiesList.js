import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = () => {
  return useLiveCollection(() => CommunityRepository.getRecommendedCommunities());
};

export default useCommunitiesList;
