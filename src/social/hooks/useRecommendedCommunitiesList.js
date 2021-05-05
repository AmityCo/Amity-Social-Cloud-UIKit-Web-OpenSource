import { CommunityRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommunitiesList = () => {
  const [communities, hasMore, loadMore] = useLiveCollection(() =>
    CommunityRepository.getRecommendedCommunities(),
  );

  return [communities, hasMore, loadMore];
};

export default useCommunitiesList;
