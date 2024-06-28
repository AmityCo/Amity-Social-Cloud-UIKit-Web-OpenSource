import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useCommunitiesCollection({
  queryParams,
  shouldCall = true,
}: {
  queryParams?: Parameters<typeof CommunityRepository.getCommunities>[0];
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getCommunities,
    params: queryParams as Parameters<typeof CommunityRepository.getCommunities>[0],
    shouldCall: !!queryParams && shouldCall,
  });

  return {
    communities: items,
    ...rest,
  };
}
