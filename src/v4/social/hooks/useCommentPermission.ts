import { useMemo } from 'react';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { Permissions } from '~/v4/social/constants/permissions';

const useCommentPermission = ({
  comment,
  community,
}: {
  comment: Amity.Comment;
  community?: Amity.Community | null;
}) => {
  const { currentUserId, client } = useSDK();

  const isMyComment = comment.userId === currentUserId;

  const permissions = useMemo(() => {
    if (isMyComment) {
      return {
        canEdit: true,
        canDelete: true,
        canReport: false,
      };
    }

    if (community != null) {
      const canEdit =
        client
          ?.hasPermission(Permissions.EditCommunityFeedCommentPermission)
          .community(community.communityId) ?? false;

      const canDelete =
        client
          ?.hasPermission(Permissions.DeleteCommunityFeedCommentPermission)
          .community(community.communityId) ?? false;

      return {
        canEdit,
        canDelete,
        canReport: true,
      };
    }

    const canEdit =
      client?.hasPermission(Permissions.EditUserFeedCommentPermission).currentUser() ?? false;

    const canDelete =
      client?.hasPermission(Permissions.DeleteUserFeedCommentPermission).currentUser() ?? false;

    return {
      canEdit,
      canDelete,
      canReport: true,
    };
  }, [isMyComment, community, client]);

  return permissions;
};

export default useCommentPermission;
