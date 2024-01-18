import { CommunityPostSettings } from '@amityco/ts-sdk';
import { useMemo } from 'react';
import useUser from '~/core/hooks/useUser';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';
import useCommunityModeratorsCollection from './collections/useCommunityModeratorsCollection';
import useCommunityMembersCollection from './collections/useCommunityMembersCollection';

const useCommunityPostPermission = ({
  post,
  childrenPosts = [],
  community,
  userId,
}: {
  post?: Amity.Post | null;
  childrenPosts?: Amity.Post[];
  community?: Amity.Community | null;
  userId?: string;
}) => {
  const { moderators } = useCommunityModeratorsCollection(community?.communityId);
  const { members } = useCommunityMembersCollection(community?.communityId);
  const { posts: reviewingPosts } = usePostsCollection({
    targetType: 'community',
    targetId: community?.communityId,
    feedType: 'reviewing',
  });
  const user = useUser(userId);

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

  const member = members.find((member) => member.userId === userId);
  const moderator = moderators.find((moderator) => moderator.userId === userId);
  const isMyPost = post?.postedUserId === userId;
  const isPostUnderReview = useMemo(() => {
    if (community?.postSetting != CommunityPostSettings.ANYONE_CAN_POST) {
      return reviewingPosts.find((reviewingPost) => reviewingPost.postId === post?.postId) != null;
    }
    return false;
  }, [community, reviewingPosts]);
  const isGlobalAdmin = user?.roles.find((role) => role === 'global-admin') != null;

  const isModerator = moderator != null;
  const isMember = member != null;

  if (community == null) {
    return {
      isPostUnderReview: false,
      isModerator: false,
      canEdit: (isGlobalAdmin || isMyPost) && isEditable,
      canReport: isGlobalAdmin || !isMyPost,
      canDelete: isGlobalAdmin || isMyPost,
      canReview: false,
    };
  }

  return {
    isPostUnderReview,
    isModerator,
    canEdit: (isGlobalAdmin || isModerator) && isEditable,
    canReview: isGlobalAdmin || isModerator,
    canDelete: (!isPostUnderReview && isModerator) || (isMyPost && isMember),
    canReport: !isPostUnderReview ? !isMyPost && (isModerator || isMember) : !isMyPost,
  };
};

export default useCommunityPostPermission;
