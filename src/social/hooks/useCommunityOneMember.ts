import { CommunityRepository } from '@amityco/ts-sdk';
import useUser from '~/core/hooks/useUser';
import {
  canEditCommunity,
  canReviewCommunityPosts,
  isAdmin,
  isModerator,
} from '~/helpers/permissions';
import { isCommunityMember } from '~/helpers/utils';
import useLiveCollection from '~/core/hooks/useLiveCollection';

/**
 *
 * @deprecated
 */
const useCommunityOneMember = (
  communityId?: string | null,
  currentUserId?: string | null,
  communityOwnerId?: string | null,
) => {
  const { items: members } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: {
      communityId: communityId as string,
    },
    shouldCall: () => !!communityId,
  });

  const currentMember = members.find((member) => member.userId === currentUserId);

  const user = useUser(currentUserId);

  const isCommunityModerator = isModerator(currentMember?.roles);
  const hasModeratorPermissions =
    (isCommunityMember(currentMember) && isCommunityModerator) ||
    isModerator(user?.roles) ||
    isAdmin(user?.roles);

  return {
    isCurrentMemberReady: !!currentUserId,
    currentMember,
    isCommunityModerator,
    hasModeratorPermissions,
    canEditCommunity: canEditCommunity({
      user: user || undefined,
      communityUser: currentMember,
    }),
    canReviewCommunityPosts: canReviewCommunityPosts({
      user: user || undefined,
      communityUser: currentMember,
    }),
  };
};

export default useCommunityOneMember;
