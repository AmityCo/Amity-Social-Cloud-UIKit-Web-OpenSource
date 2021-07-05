import { CommunityRepository, CommunityUserMembership } from '@amityco/js-sdk';
import useUser from '~/core/hooks/useUser';
import {
  canEditCommunity,
  canReviewCommunityPosts,
  isAdmin,
  isModerator,
} from '~/helpers/permissions';
import useLiveObject from '~/core/hooks/useLiveObject';

const useCommunityOneMember = (communityId, currentUserId, communityOwnerId) => {
  const currentMember = useLiveObject(
    () => CommunityRepository.memberByCommunityIdAndUserId({ communityId, userId: currentUserId }),
    [communityId, currentUserId],
  );

  const { user } = useUser(currentUserId);

  const isCommunityOwner = currentUserId === communityOwnerId;

  const isCommunityModerator = isModerator(currentMember?.roles);
  const isJoined = currentMember.communityMembership === CommunityUserMembership.Member;

  const hasModeratorPermissions =
    (isJoined && (isCommunityModerator || isCommunityOwner)) ||
    isModerator(user?.roles) ||
    isAdmin(user);

  return {
    isCurrentMemberReady: !!currentMember.userId,
    currentMember,
    isCommunityOwner,
    isCommunityModerator,
    hasModeratorPermissions,
    canEditCommunity:
      canEditCommunity(isCommunityOwner, currentMember) || canEditCommunity(isCommunityOwner, user),
    canReviewCommunityPosts:
      canReviewCommunityPosts(isCommunityOwner, currentMember) ||
      canReviewCommunityPosts(isCommunityOwner, user),
  };
};

export default useCommunityOneMember;
