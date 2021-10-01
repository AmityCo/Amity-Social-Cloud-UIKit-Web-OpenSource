import { PostDataType } from '@amityco/js-sdk';
// TODO: refactor to align with SDK roles once available.
import { isCommunityMember, isCommunityPost, isPostUnderReview } from '~/helpers/utils';

const ADMIN = 'global-admin';
const MODERATOR_ROLE = 'moderator';

export const isModerator = userRoles => {
  if (!userRoles?.length) {
    return false;
  }

  return userRoles.includes(MODERATOR_ROLE);
};

export const isAdmin = userRoles => {
  if (!userRoles?.length) {
    return false;
  }

  return userRoles.includes(ADMIN);
};

function isPostModerator({ userId, user, communityUser, post, community }) {
  const hasModeratorPermissions =
    isAdmin(user.roles) || isModerator(user.roles) || isModerator(communityUser.roles);

  if (isCommunityPost(post)) {
    const isCommunityOwner = community.userId === userId;

    return hasModeratorPermissions || (isCommunityOwner && isCommunityMember(communityUser));
  }

  return hasModeratorPermissions;
}

export function canEditCommunity({ userId, user, communityUser, community }) {
  const isCommunityOwner = community.userId === userId;

  if (isCommunityOwner && isCommunityMember(communityUser)) {
    return true;
  }

  return isAdmin(user.roles) || isModerator(user.roles) || isModerator(communityUser.roles);
}

export function canReviewCommunityPosts(data) {
  return canEditCommunity(data);
}

export function canDeletePost({ userId, user, communityUser, post, community }) {
  const isPostModer = isPostModerator({ userId, user, communityUser, post, community });
  const isMyPost = post.postedUserId === userId;

  if (isCommunityPost(post)) {
    const isUnderReview = isPostUnderReview(post, community);
    const isMember = isCommunityMember(communityUser);

    return (!isUnderReview && isPostModer) || (isMyPost && isMember);
  }

  return isPostModer || isMyPost;
}

export function canEditPost({ userId, user, communityUser, post, community, childrenPosts }) {
  if (childrenPosts.find(childPost => childPost.dataType === PostDataType.LivestreamPost)) {
    return false;
  }

  const isPostModer = isPostModerator({ userId, user, communityUser, post, community });
  const isMyPost = post.postedUserId === userId;

  if (isCommunityPost(post)) {
    if (isPostUnderReview(post, community)) {
      return false;
    }

    return isPostModer || (isMyPost && isCommunityMember(communityUser));
  }

  return isPostModer || isMyPost;
}

export function canReportPost({ userId, user, communityUser, post, community }) {
  const isPostModer = isPostModerator({ userId, user, communityUser, post, community });
  const isMyPost = post.postedUserId === userId;

  if (isCommunityPost(post)) {
    if (isPostUnderReview(post, community)) {
      return false;
    }

    return !isMyPost && (isPostModer || isCommunityMember(communityUser));
  }

  return !isMyPost;
}
