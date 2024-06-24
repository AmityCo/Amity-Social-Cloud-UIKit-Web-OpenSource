import { useMemo } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';

export const usePostPermissions = ({
  post,
  community,
}: {
  post: Amity.Post;
  community?: Amity.Community | null;
}) => {
  const { currentUserId } = useSDK();

  const isCommunityModerator = useMemo(() => {
    if (post && community) {
      return post.targetType === 'community' && post.targetId === community.communityId;
    }
    return false;
  }, []);

  const isOwner = post.postedUserId === currentUserId;

  return {
    isCommunityModerator,
    isOwner,
  };
};
