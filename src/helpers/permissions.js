// TODO: refactor to align with SDK roles once available.
const ADMIN = 'global-admin';
const MODERATOR_ROLE = 'moderator';
const EDIT_COMMUNITY = 'EDIT_COMMUNITY';
const REVIEW_COMMUNITY_POST = 'REVIEW_COMMUNITY_POST';

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

export const canEditCommunity = (isOwner, communityUser) => {
  if (isOwner) {
    return true;
  }

  if (!communityUser?.permissions) {
    return false;
  }

  return communityUser.permissions.includes(EDIT_COMMUNITY);
};

export const canReviewCommunityPosts = (isOwner, communityUser) => {
  if (isOwner) {
    return true;
  }

  if (!communityUser?.permissions) {
    return false;
  }

  return communityUser.permissions.includes(REVIEW_COMMUNITY_POST);
};
