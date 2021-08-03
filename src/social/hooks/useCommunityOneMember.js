import { CommunityRepository } from '@amityco/js-sdk';
import useUser from '~/core/hooks/useUser';
import {
  canEditCommunity,
  canReviewCommunityPosts,
  isAdmin,
  isModerator,
} from '~/helpers/permissions';
import useLiveObject from '~/core/hooks/useLiveObject';
import { isCommunityMember } from '~/helpers/utils';

const useCommunityOneMember = (communityId, currentUserId, communityOwnerId) => {
  const currentMember = useLiveObject(
    () => CommunityRepository.memberByCommunityIdAndUserId({ communityId, userId: currentUserId }),
    [communityId, currentUserId],
  );

  const { user } = useUser(currentUserId);

  const isCommunityOwner = currentUserId === communityOwnerId;

  const isCommunityModerator = isModerator(currentMember?.roles);
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && (isCommunityModerator || isCommunityOwner)) ||
    isModerator(user?.roles) ||
    isAdmin(user?.roles);

  return {
    isCurrentMemberReady: !!currentMember.userId,
    currentMember,
    isCommunityOwner,
    isCommunityModerator,
    hasModeratorPermissions,
    canEditCommunity: canEditCommunity({
      userId: currentUserId,
      user,
      communityUser: currentMember,
      community: { userId: communityOwnerId },
    }),
    canReviewCommunityPosts: canReviewCommunityPosts({
      userId: currentUserId,
      user,
      communityUser: currentMember,
      community: { userId: communityOwnerId },
    }),
  };
};

export default useCommunityOneMember;
