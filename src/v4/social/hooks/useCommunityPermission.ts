import useSDK from '~/v4/core/hooks/useSDK';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';

const useCommunityPermission = ({ community }: { community?: Amity.Community | null }) => {
  const { currentUserId, userRoles } = useSDK();
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });

  const moderator = moderators.find((moderator) => moderator.userId === currentUserId);

  const isGlobalAdmin = userRoles.find((role) => role === 'global-admin') != null;

  const isModerator = moderator != null;

  return {
    isModerator,
    canEdit: isGlobalAdmin || isModerator,
    canReview: isGlobalAdmin || isModerator,
  };
};

export default useCommunityPermission;
