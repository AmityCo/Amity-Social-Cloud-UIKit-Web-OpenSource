import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { MemberRoles } from '~/v4/social/constants/memberRoles';

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
