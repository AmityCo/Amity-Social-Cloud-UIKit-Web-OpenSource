// // TODO: refactor to align with SDK roles once available.

import { isCommunityMember, isCommunityPost, isPostUnderReview } from '~/v4/helpers/utils';
import { MemberRoles } from '~/v4/social/constants/memberRoles';
import { Permissions } from '~/v4/social/constants/permissions';

const ADMIN = 'global-admin';
const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR, MODERATOR, SUPER_MODERATOR } = MemberRoles;

export const isModerator = (userRoles?: string[]) => {
  if (!userRoles?.length) {
    return false;
  }

  const roles: string[] = [COMMUNITY_MODERATOR, CHANNEL_MODERATOR, MODERATOR, SUPER_MODERATOR];

  return userRoles.some((role) => roles.includes(role));
};

export const isAdmin = (userRoles?: string[]) => {
  if (!userRoles?.length) {
    return false;
  }

  return userRoles.includes(ADMIN);
};

/**
 *
 * @deprecated
 */
function isPostModerator({
  user,
  communityUser,
  post,
}: {
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
  post?: Amity.Post;
}) {
  const hasModeratorPermissions =
    isAdmin(user?.roles) || isModerator(user?.roles) || isModerator(communityUser?.roles);

  if (isCommunityPost(post)) {
    return hasModeratorPermissions && isCommunityMember(communityUser);
  }

  return hasModeratorPermissions;
}

/**
 *
 * @deprecated
 */
export function canEditCommunity({
  user,
  communityUser,
}: {
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
}) {
  return isAdmin(user?.roles) || isModerator(user?.roles) || isModerator(communityUser?.roles);
}

/**
 *
 * @deprecated
 */
export function canReviewCommunityPosts(data: {
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
}) {
  return canEditCommunity(data);
}

/**
 *
 * @deprecated
 */
export function canDeletePost({
  userId,
  user,
  communityUser,
  post,
  community,
}: {
  userId?: string;
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
  post?: Amity.Post;
  community?: Amity.Community;
}) {
  const isPostModer = isPostModerator({ user, communityUser, post });
  const isMyPost = post?.postedUserId === userId;

  if (isCommunityPost(post)) {
    const isUnderReview = isPostUnderReview(post, community);
    const isMember = isCommunityMember(communityUser);

    return (!isUnderReview && isPostModer) || (isMyPost && isMember);
  }

  return isPostModer || isMyPost;
}

/**
 *
 * @deprecated
 */
export function canEditPost({
  userId,
  user,
  communityUser,
  post,
  community,
  childrenPosts = [],
}: {
  userId?: string;
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
  post?: Amity.Post;
  community?: Amity.Community;
  childrenPosts?: Amity.Post[];
}) {
  if (
    childrenPosts.find(
      (childPost) => childPost.dataType === 'liveStream' || childPost.dataType === 'poll',
    )
  ) {
    return false;
  }

  const isPostModer = isPostModerator({ user, communityUser, post });
  const isMyPost = post?.postedUserId === userId;

  if (isCommunityPost(post)) {
    if (isPostUnderReview(post, community)) {
      return false;
    }

    return isPostModer || (isMyPost && isCommunityMember(communityUser));
  }

  return isPostModer || isMyPost;
}

/**
 *
 * @deprecated
 */
export function canReportPost({
  userId,
  user,
  communityUser,
  post,
  community,
}: {
  userId?: string;
  user?: Pick<Amity.User, 'roles'>;
  communityUser?: Amity.Membership<'community'>;
  post?: Amity.Post;
  community?: Amity.Community;
}) {
  const isPostModer = isPostModerator({ user, communityUser, post });
  const isMyPost = post?.postedUserId === userId;

  if (isCommunityPost(post)) {
    if (isPostUnderReview(post, community)) {
      return false;
    }

    return isMyPost === false && (isPostModer || isCommunityMember(communityUser));
  }

  return isMyPost === false;
}

export const checkStoryPermission = (
  client: Amity.Client | null | undefined,
  communityId?: string,
): boolean => {
  if (!client) {
    return false;
  }

  if (communityId) {
    const communityPermission = client
      .hasPermission(Permissions.ManageStoryPermission)
      .community(communityId);
    return communityPermission;
  }

  return false;
};

export function formatTimeAgo(dateString: string | Date | undefined) {
  if (!dateString) return;
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - givenDate.getTime()) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return 'Just now';
  } else if (timeDifferenceInSeconds >= 60 && timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours}h`;
  }
}
