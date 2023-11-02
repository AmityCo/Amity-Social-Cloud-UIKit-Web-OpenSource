import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useTrendingCommunitiesList = () => {
  return useLiveCollection(() => CommunityRepository.getTopTrendingCommunities(), []);

};

export default useTrendingCommunitiesList;
