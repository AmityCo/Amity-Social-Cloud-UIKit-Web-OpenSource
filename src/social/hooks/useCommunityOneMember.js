import { useMemo } from 'react';
import { CommunityRepository } from 'eko-sdk';

const MODERATOR_ROLE = 'moderator';

const useCommunityOneMember = (communityId, currentUserId, communityOwnerId) => {
  const currentMember = useMemo(
    () =>
      communityId &&
      CommunityRepository
        .memberByCommunityIdAndUserId({ communityId, userId: currentUserId })
        .model,
    [communityId, currentUserId],
  );

  const isCommunityOwner = currentUserId === communityOwnerId;

  const isCommunityModerator = currentMember && currentMember.roles.includes(MODERATOR_ROLE);

  const hasModeratorPermissions = isCommunityModerator || isCommunityOwner;

  return {
    currentMember,
    isCommunityOwner,
    isCommunityModerator,
    hasModeratorPermissions,
  };
};
export default useCommunityOneMember;
