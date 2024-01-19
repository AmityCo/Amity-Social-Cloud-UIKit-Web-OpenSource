import { CommunityRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

// breaking changes

const useCommunity = (communityId: string | null | undefined) => {
  return useLiveObject({
    fetcher: CommunityRepository.getCommunity,
    params: communityId,
    shouldCall: () => !!communityId,
  });
};

export default useCommunity;
