import { CommunityRepository } from '@amityco/ts-sdk';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';

// breaking changes

/**
 *
 * @deprecated use useCommunitiesCollection instead
 */
const useCommunitiesList = (
  queryParams?: Parameters<typeof CommunityRepository.getCommunities>[0],
  shouldCall?: () => boolean,
) => {
  const { communities, hasMore, loadMore } = useCommunitiesCollection(queryParams, shouldCall);

  return [communities, hasMore, loadMore];
};

export default useCommunitiesList;
