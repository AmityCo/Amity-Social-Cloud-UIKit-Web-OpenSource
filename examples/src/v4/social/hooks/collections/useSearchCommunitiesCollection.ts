import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useSearchCommunitiesCollection({
  queryParams,
  shouldCall = true,
}: {
  queryParams?: Parameters<typeof CommunityRepository.searchCommunities>[0];
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.searchCommunities,
    params: queryParams as Parameters<typeof CommunityRepository.searchCommunities>[0],
    shouldCall: shouldCall,
  });

  return {
    communities: items,
    ...rest,
  };
}
