import { CommunityRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

const useCommunity = ({
  communityId,
  shouldCall = () => true,
}: {
  communityId: string | null | undefined;
  shouldCall?: () => boolean;
}) => {
  const { item, ...rest } = useLiveObject({
    fetcher: CommunityRepository.getCommunity,
    params: communityId,
    shouldCall: () => shouldCall() && !!communityId,
  });

  return {
    community: item,
    ...rest,
  };
};

export default useCommunity;
