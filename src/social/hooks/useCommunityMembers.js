import { CommunityRepository, EkoCommunityFilter } from 'eko-sdk';

import useCommunity from '~/social/hooks/useCommunity';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const FILTER_BY_MODERATOR_ROLE = 'moderator';

const useCommunityMembers = communityId => {
  const { community } = useCommunity(communityId);

  const [members, hasMoreMembers, loadMoreMembers] = useLiveCollection(
    () =>
      CommunityRepository.getCommunityMembers({
        communityId,
        memberships: [EkoCommunityFilter.Member],
      }),
    [communityId],
  );

  const [moderators, hasMoreModerators, loadMoreModerators] = useLiveCollection(
    () =>
      CommunityRepository.getCommunityMembers({
        communityId,
        memberships: [EkoCommunityFilter.Member],
        roles: [FILTER_BY_MODERATOR_ROLE],
      }),
    [communityId],
  );

  const assignRoleToUsers = (role, userIds) =>
    CommunityRepository.assignRoleToUsers({ communityId, role, userIds });

  const removeRoleFromUsers = (role, userIds) =>
    CommunityRepository.removeRoleFromUsers({ communityId, role, userIds });

  const addMembers = userIds => CommunityRepository.addMembers({ communityId, userIds });
  const removeMembers = userIds => CommunityRepository.removeMembers({ communityId, userIds });

  return {
    members,
    hasMoreMembers,
    loadMoreMembers,
    membersCount: community.membersCount,
    assignRoleToUsers,
    removeRoleFromUsers,
    moderators,
    hasMoreModerators,
    loadMoreModerators,
    addMembers,
    removeMembers,
  };
};

export default useCommunityMembers;
