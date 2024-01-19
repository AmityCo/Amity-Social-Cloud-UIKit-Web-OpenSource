import useSDK from '~/core/hooks/useSDK';
import useCommunityModeratorsCollection from './collections/useCommunityModeratorsCollection';

const useCommunityPermission = ({ community }: { community?: Amity.Community | null }) => {
  const { currentUserId, userRoles } = useSDK();
  const { moderators } = useCommunityModeratorsCollection(community?.communityId);

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
