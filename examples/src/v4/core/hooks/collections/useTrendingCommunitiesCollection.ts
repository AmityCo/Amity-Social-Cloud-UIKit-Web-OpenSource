import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export function useTrendingCommunitiesCollection({
  params,
  enabled,
}: {
  params?: Parameters<typeof CommunityRepository.getTrendingCommunities>[0];
  enabled?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getTrendingCommunities,
    params: {
      ...params,
      limit: params?.limit || 10,
    },
    shouldCall: enabled,
  });

  return {
    trendingCommunities: items,
    ...rest,
  };
}
