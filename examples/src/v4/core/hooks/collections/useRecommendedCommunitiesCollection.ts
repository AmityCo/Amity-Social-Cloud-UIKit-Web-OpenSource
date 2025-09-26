import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export function useRecommendedCommunitiesCollection({
  params,
  enabled = true,
}: {
  params: Parameters<typeof CommunityRepository.getRecommendedCommunities>[0];
  enabled?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getRecommendedCommunities,
    params,
    shouldCall: enabled,
  });

  return {
    recommendedCommunities: items,
    ...rest,
  };
}
