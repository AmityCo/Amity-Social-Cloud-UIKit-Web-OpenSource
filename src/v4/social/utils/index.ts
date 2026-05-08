// // TODO: refactor to align with SDK roles once available.

import { isCommunityMember, isCommunityPost, isPostUnderReview } from '~/v4/helpers/utils';
import { resolveString, useString } from '~/v4/core/localization';
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

export function formatTimeAgo(dateString: string | Date | undefined): string | undefined {
  if (!dateString) return;

  const givenDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - givenDate.getTime()) / 1000);

  if (timeDifferenceInSeconds === 1) {
    return useString('amity_common_time_just_now');
  } else if (timeDifferenceInSeconds > 1 && timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds}${useString('amity_common_time_time_seconds_suffix')}`;
  } else if (timeDifferenceInSeconds >= 60 && timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes}${useString('amity_common_time_time_minutes_suffix')}`;
  } else if (timeDifferenceInSeconds >= 3600 && timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours}${useString('amity_common_time_time_hours_suffix')}`;
  }
}

export function canCreatePostCommunity(
  client: Amity.Client | null | undefined,
  community: Amity.Community,
) {
  if (!client) {
    return false;
  }

  const communityPermission = client
    .hasPermission(Permissions.CreatePrivilegedPostPermission)
    .community(community.communityId);

  if (communityPermission || community.postSetting !== 'ONLY_ADMIN_CAN_POST') {
    return true;
  }

  return false;
}

export const checkEditCommunityPermission = (
  client: Amity.Client | null | undefined,
  communityId?: string,
) => {
  if (!client) {
    return false;
  }
  if (communityId) {
    const communityPermission = client
      .hasPermission(Permissions.EditCommunityPermission)
      .community(communityId);
    return communityPermission;
  }

  return false;
};

export const checkReviewPostPermission = (
  client: Amity.Client | null | undefined,
  communityId?: string,
) => {
  if (!client) {
    return false;
  }

  if (communityId) {
    const communityPermission = client
      .hasPermission(Permissions.ReviewCommunityPost)
      .community(communityId);
    return communityPermission;
  }

  return false;
};

export const checkDeleteCommunityPermission = (
  client: Amity.Client | null | undefined,
  communityId?: string,
) => {
  if (!client) {
    return false;
  }

  if (communityId) {
    const communityPermission = client
      .hasPermission(Permissions.DeleteCommunityPermission)
      .community(communityId);
    return communityPermission;
  }

  return false;
};

export const checkDeleteCommunityPostPermission = (
  client: Amity.Client | null | undefined,
  targetType: string,
) => {
  if (!client || !targetType) {
    return false;
  }

  const communityPermission =
    client.hasPermission(Permissions.DeleteCommunityFeedPostPermission).currentUser() &&
    targetType === 'community';
  return communityPermission;
};

export const formatAltText = ({
  total,
  altText,
  current,
  leftCount = 0,
  isLastImage = false,
}: {
  total: number;
  current: number;
  altText?: string;
  leftCount?: number;
  isLastImage?: boolean;
}) =>
  leftCount && isLastImage && total > 4
    ? `Activate to view ${leftCount} more photos`
    : `Photo ${current} of ${total}: ${altText || resolveString('amity_social_label_no_description_available')}`;
