import { CommunityRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';
import { MemberRoles } from '~/social/constants';

const { COMMUNITY_MODERATOR } = MemberRoles;

export default function useCommunityModeratorsCollection(communityId?: string) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: { communityId: communityId as string, roles: [COMMUNITY_MODERATOR] },
    shouldCall: () => !!communityId,
  });

  return {
    moderators: items,
    ...rest,
  };
}
