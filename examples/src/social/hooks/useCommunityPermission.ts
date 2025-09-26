import useSDK from '~/core/hooks/useSDK';
import { Permissions } from '../constants';
import useCommunityModeratorsCollection from './collections/useCommunityModeratorsCollection';

const useCommunityPermission = ({ community }: { community?: Amity.Community | null }) => {
  const { currentUserId, userRoles, client } = useSDK();
  const { moderators } = useCommunityModeratorsCollection(community?.communityId);

  const moderator = moderators.find((moderator) => moderator.userId === currentUserId);

  const isGlobalAdmin = userRoles.find((role) => role === 'global-admin') != null;

  const isModerator = moderator != null;

  const canCreatePost =
    (community?.communityId &&
      client
        ?.hasPermission(Permissions.CreatePivillegedPostPermission)
        .community(community?.communityId)) ||
    community?.postSetting !== 'ONLY_ADMIN_CAN_POST';

  return {
    isModerator,
    canEdit: isGlobalAdmin || isModerator,
    canReview: isGlobalAdmin || isModerator,
    canCreatePost: !!canCreatePost,
  };
};

export default useCommunityPermission;
