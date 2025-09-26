import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

// breaking changes

export default function useCommunitiesCollection(
  queryParams?: Parameters<typeof CommunityRepository.getCommunities>[0],
  shouldCall?: () => boolean,
) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.getCommunities,
    params: queryParams as Parameters<typeof CommunityRepository.getCommunities>[0],
    shouldCall: () => !!queryParams && (shouldCall ? shouldCall?.() : true),
  });

  return {
    communities: items,
    ...rest,
  };
}
