import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UseCommunityParams = {
  communityId?: Parameters<typeof CommunityRepository.getCommunity>[0];
  shouldCall?: boolean;
};

const useCommunity = ({ communityId, shouldCall = true }: UseCommunityParams) => {
  const { item, ...rest } = useLiveObjectV4({
    fetcher: CommunityRepository.getCommunity,
    params: communityId!,
    shouldCall: shouldCall && !!communityId,
  });

  return { community: item, ...rest };
};

export default useCommunity;
