import { CommunityRepository } from '@amityco/ts-sdk';

import useCommunity from '~/social/hooks/useCommunity';
import useLiveCollection from '~/core/hooks/useLiveCollection';
import { MemberRoles } from '~/social/constants';

const { COMMUNITY_MODERATOR } = MemberRoles;

/**
 *
 * @deprecated use useCommunityMembersCollection and useCommunityModeratorsCollection instead
 */
const useCommunityMembers = (communityId: string) => {
  const community = useCommunity(communityId);

  const {
    items: members,
    hasMore: hasMoreMembers,
    loadMore: loadMoreMembers,
  } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: { communityId },
    shouldCall: () => !!communityId,
  });

  const {
    items: moderators,
    hasMore: hasMoreModerators,
    loadMore: loadMoreModerators,
  } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: {
      communityId,
      roles: [COMMUNITY_MODERATOR],
    },
    shouldCall: () => !!communityId,
  });

  const assignRolesToUsers = (roles: string[], userIds: string[]) =>
    CommunityRepository.Moderation.addRoles(communityId, roles, userIds);

  const removeRolesFromUsers = (roles: string[], userIds: string[]) =>
    CommunityRepository.Moderation.removeRoles(communityId, roles, userIds);

  const addMembers = (userIds: string[]) =>
    CommunityRepository.Membership.addMembers(communityId, userIds);
  const removeMembers = (userIds: string[]) =>
    CommunityRepository.Membership.removeMembers(communityId, userIds);

  return {
    members,
    hasMoreMembers,
    loadMoreMembers,
    membersCount: community?.membersCount ?? 0,
    assignRolesToUsers,
    removeRolesFromUsers,
    moderators,
    hasMoreModerators,
    loadMoreModerators,
    addMembers,
    removeMembers,
  };
};

export default useCommunityMembers;
