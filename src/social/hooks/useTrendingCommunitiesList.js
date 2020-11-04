import { CommunityRepository } from 'eko-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const useTrendingCommunitiesList = () => {
  const [communities, hasMore, loadMore] = useLiveCollection(
    () => CommunityRepository.getTopTrendingCommunities(),
    [],
  );

  return [communities, hasMore, loadMore];
};

export default useTrendingCommunitiesList;
