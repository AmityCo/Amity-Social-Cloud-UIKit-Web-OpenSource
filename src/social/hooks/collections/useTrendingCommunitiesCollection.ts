import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useTrendingCommunitiesCollection(params?: Amity.PageLimit) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getTrendingCommunities,
    params: {
      ...params,
      limit: params?.limit || 10,
    },
  });

  return {
    communities: items,
    ...rest,
  };
}
