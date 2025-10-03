import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import useSDK from '~/v4/core/hooks/useSDK';

export default function useCommunityMembersCollection({
  queryParams,
  shouldCall = true,
}: {
  queryParams?: Parameters<typeof CommunityRepository.Membership.getMembers>[0];
  shouldCall?: boolean;
}) {
  const { isVisitorOrBot } = useSDK();
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: {
      ...(queryParams as Parameters<typeof CommunityRepository.Membership.getMembers>[0]),
      includeDeleted: false,
      limit: 20,
    },
    shouldCall: !!queryParams?.communityId && shouldCall && !isVisitorOrBot,
  });

  return {
    members: items,
    ...rest,
  };
}
