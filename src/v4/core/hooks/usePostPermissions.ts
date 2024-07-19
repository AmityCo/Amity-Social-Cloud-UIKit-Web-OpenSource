import { useMemo } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';

export const usePostPermissions = ({
  post,
  community,
}: {
  post: Amity.Post;
  community?: Amity.Community | null;
}) => {
  const { currentUserId } = useSDK();

  const isCommunityPost = useMemo(
    () => post.targetType === 'community' && post.targetId === community?.communityId,
    [post.targetType, community?.communityId],
  );

  const { moderators } = useCommunityModeratorsCollection({
    communityId: community?.communityId,
    shouldCall: isCommunityPost,
  });

  const isCommunityModerator = useMemo(() => {
    if (isCommunityPost) {
      return moderators.some((moderator) => moderator.userId === currentUserId);
    }
    return false;
  }, [moderators, isCommunityPost, currentUserId]);

  const isOwner = post.postedUserId === currentUserId;

  return {
    isCommunityModerator,
    isOwner,
  };
};
