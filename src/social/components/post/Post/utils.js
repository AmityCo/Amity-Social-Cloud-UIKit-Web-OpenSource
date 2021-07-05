import { CommunityUserMembership, PostTargetType } from '@amityco/js-sdk';
import { isModerator } from '~/helpers/permissions';

function isCommunityMember(currentMember) {
  return currentMember?.communityMembership === CommunityUserMembership.Member;
}

export function isPostUnderReview(post, community) {
  return (
    !!community.reviewingFeed?.feedId &&
    !!post.feedId &&
    community.reviewingFeed?.feedId === post.feedId
  );
}

export function canEdit({ post, community, userRoles, currentUserId, currentMember }) {
  const isCommunityPost = post.targetType === PostTargetType.CommunityFeed;
  const isModer = isModerator(userRoles);
  const isMyPost = post.postedUserId === currentUserId;

  if (isCommunityPost) {
    if (community.needApprovalOnPostCreation) {
      return false;
    }

    return isModer || (isMyPost && isCommunityMember(currentMember));
  }
  return isModer || isMyPost;
}

export function canDelete({ post, community, userRoles, currentUserId, currentMember }) {
  const isCommunityPost = post.targetType === PostTargetType.CommunityFeed;
  const isModer = isModerator(userRoles);
  const isMyPost = post.postedUserId === currentUserId;

  if (isCommunityPost) {
    const isUnderReview = isPostUnderReview(post, community);
    const isMember = isCommunityMember(currentMember);

    return (!isUnderReview && isModer) || (isMyPost && isMember);
  }
  return isModer || isMyPost;
}

export function canReport({ post, community, userRoles, currentUserId, currentMember }) {
  const isCommunityPost = post.targetType === PostTargetType.CommunityFeed;
  const isModer = isModerator(userRoles);
  const isMyPost = post.postedUserId === currentUserId;

  if (isCommunityPost) {
    if (isPostUnderReview(post, community)) {
      return false;
    }

    return !isMyPost && (isModer || isCommunityMember(currentMember));
  }
  return !isMyPost;
}

export function getAvailableActions(data) {
  return {
    canEdit: canEdit(data),
    canDelete: canDelete(data),
    canReport: canReport(data),
  };
}
