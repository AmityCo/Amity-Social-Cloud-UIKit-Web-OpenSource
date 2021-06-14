import { CommunityRepository } from '@amityco/js-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

const MODERATOR_ROLE = 'moderator';

const useCommunityOneMember = (communityId, currentUserId, communityOwnerId) => {
  const currentMember = useLiveObject(
    () => CommunityRepository.memberByCommunityIdAndUserId({ communityId, userId: currentUserId }),
    [communityId, currentUserId],
  );

  const isCommunityOwner = currentUserId === communityOwnerId;

  const isCommunityModerator = currentMember.roles && currentMember.roles.includes(MODERATOR_ROLE);

  const hasModeratorPermissions = isCommunityModerator || isCommunityOwner;

  return {
    currentMember,
    isCommunityOwner,
    isCommunityModerator,
    hasModeratorPermissions,
  };
};
export default useCommunityOneMember;
