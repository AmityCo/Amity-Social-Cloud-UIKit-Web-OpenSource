import { useMemo } from 'react';
import useSDK from '~/core/hooks/useSDK';

const usePostPermission = ({
  post,
  childrenPosts = [],
}: {
  post?: Amity.Post;
  childrenPosts?: Amity.Post[];
}) => {
  const { currentUserId, userRoles } = useSDK();

  const isEditable = useMemo(() => {
    if (
      childrenPosts.find(
        (childPost) => childPost.dataType === 'liveStream' || childPost.dataType === 'poll',
      )
    ) {
      return false;
    }
    return true;
  }, [childrenPosts]);

  const isMyPost = post?.postedUserId === currentUserId;
  const isGlobalAdmin = userRoles.find((role) => role === 'global-admin') != null;

  return {
    canEdit: (isGlobalAdmin || isMyPost) && isEditable,
    canReport: isGlobalAdmin || !isMyPost,
    canDelete: isGlobalAdmin || isMyPost,
  };
};

export default usePostPermission;
