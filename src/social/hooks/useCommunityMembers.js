import { CommunityRepository, CommunityFilter } from '@amityco/js-sdk';

import useCommunity from '~/social/hooks/useCommunity';
import useLiveCollection from '~/core/hooks/useLiveCollection';
import { MemberRoles } from '~/social/constants';

const { COMMUNITY_MODERATOR } = MemberRoles;

const useCommunityMembers = communityId => {
  const { community } = useCommunity(communityId);

  const [members, hasMoreMembers, loadMoreMembers] = useLiveCollection(
    () =>
      CommunityRepository.getCommunityMembers({
        communityId,
        memberships: [CommunityFilter.Member],
      }),
    [communityId],
  );

  const [moderators, hasMoreModerators, loadMoreModerators] = useLiveCollection(
    () =>
      CommunityRepository.getCommunityMembers({
        communityId,
        memberships: [CommunityFilter.Member],
        roles: [COMMUNITY_MODERATOR], // backward compatibility
      }),
    [communityId],
  );

  const assignRolesToUsers = (roles, userIds) =>
    CommunityRepository.assignRolesToUsers({ communityId, roles, userIds });

  const removeRolesFromUsers = (roles, userIds) =>
    CommunityRepository.removeRolesFromUsers({ communityId, roles, userIds });

  const addMembers = userIds => CommunityRepository.addMembers({ communityId, userIds });
  const removeMembers = userIds => CommunityRepository.removeMembers({ communityId, userIds });

  return {
    members,
    hasMoreMembers,
    loadMoreMembers,
    membersCount: community.membersCount,
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
