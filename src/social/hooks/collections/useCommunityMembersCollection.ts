import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useCommunityMembersCollection(communityId?: string, limit: number = 5) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: { communityId: communityId as string, limit, memberships: ['member'] },
    shouldCall: () => !!communityId,
  });

  return {
    members: items,
    ...rest,
  };
}
