import useSDK from '~/v4/core/hooks/useSDK';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { checkEditCommunityPermission, checkReviewPostPermission } from '~/v4/social/utils';

const useCommunityPermission = ({ community }: { community?: Amity.Community | null }) => {
  const { client, currentUserId, userRoles } = useSDK();
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });

  const moderator = moderators.find((moderator) => moderator.userId === currentUserId);

  const isGlobalAdmin = userRoles.find((role) => role === 'global-admin') != null;

  const isModerator = moderator != null;

  const hasEditCommunityPermission = checkEditCommunityPermission(client, community?.communityId);
  const hasReviewPostPermission = checkReviewPostPermission(client, community?.communityId);

  return {
    isModerator,
    canEdit: hasEditCommunityPermission,
    canReview: hasReviewPostPermission,
  };
};

export default useCommunityPermission;
