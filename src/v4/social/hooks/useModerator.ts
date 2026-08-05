import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { isAdmin, isModerator } from '~/v4/utils/permissions';
import { isCommunityMember } from '~/v4/helpers/utils';
import { checkEditCommunityUserPermission } from '~/v4/social/utils';
import { CommunityRepository } from '@amityco/ts-sdk';

const useModerator = ({ community }: { community?: Amity.Community | null }) => {
  const communityId = community?.communityId;
  // userRoles comes from the SDK context, not a per-instance live object: this hook runs once per
  // rendered member row, so a subscription here would mean one live object per row.
  const { client, currentUserId, userRoles } = useSDK();

  const { moderators, hasMore, loadMore } = useCommunityModeratorsCollection({
    communityId,
  });
  const currentMember = moderators.find((moderator) => moderator.userId === currentUserId);

  const isCommunityModerator = isModerator(currentMember?.roles);
  // Always evaluate against the *current* user, never the member being acted on.
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && isCommunityModerator) ||
    isModerator(userRoles) ||
    isAdmin(userRoles);

  // Promote/demote is gated on EDIT_COMMUNITY_USER at community scope, matching Android UIKit
  // (AmityCommunityMembershipSheet), so custom roles carrying that permission can moderate
  // members even though they hold no moderator role.
  const canEditMembers =
    checkEditCommunityUserPermission(client, communityId) || hasModeratorPermissions;

  const assignRolesToUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.addRoles(communityId, roles, userIds);

  const removeRolesFromUsers = (roles: string[], userIds: string[]) =>
    communityId && CommunityRepository.Moderation.removeRoles(communityId, roles, userIds);

  const removeMembers = (userIds: string[]) =>
    communityId && CommunityRepository.Membership.removeMembers(communityId, userIds);

  return {
    moderators,
    isCommunityModerator,
    currentUserId,
    hasMoreModerators: hasMore,
    loadMoreModerators: loadMore,
    hasModeratorPermissions,
    canEditMembers,
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  };
};

export default useModerator;
