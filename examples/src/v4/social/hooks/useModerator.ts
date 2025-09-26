import React from 'react';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { isAdmin, isModerator } from '~/v4/utils/permissions';
import { isCommunityMember } from '~/v4/helpers/utils';
import { CommunityRepository } from '@amityco/ts-sdk';

const useModerator = ({
  community,
  user,
}: {
  community?: Amity.Community | null;
  user?: Amity.User | null;
}) => {
  const communityId = community?.communityId;
  const { currentUserId } = useSDK();

  const { moderators, hasMore, loadMore } = useCommunityModeratorsCollection({
    communityId,
  });
  const currentMember = moderators.find((moderator) => moderator.userId === currentUserId);

  const isCommunityModerator = isModerator(currentMember?.roles);
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && isCommunityModerator) ||
    isModerator(user?.roles) ||
    isAdmin(user?.roles);

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
    assignRolesToUsers,
    removeRolesFromUsers,
    removeMembers,
  };
};

export default useModerator;
