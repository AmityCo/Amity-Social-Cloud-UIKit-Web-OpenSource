import { useMemo } from 'react';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';

export const usePostedUserInformation = ({
  post,
  community,
}: {
  post: Amity.Post;
  community?: Amity.Community | null;
}) => {
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
      return moderators.some((moderator) => moderator.userId === post?.postedUserId);
    }
    return false;
  }, [moderators, isCommunityPost, post?.postedUserId]);

  const isOwner = post.postedUserId === post?.postedUserId;

  return {
    isCommunityModerator,
    isOwner,
  };
};
