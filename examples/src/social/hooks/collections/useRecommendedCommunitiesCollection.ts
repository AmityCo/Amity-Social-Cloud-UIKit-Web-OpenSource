import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useRecommendedCommunitiesCollection(params?: Amity.PageLimit) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getRecommendedCommunities,
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
