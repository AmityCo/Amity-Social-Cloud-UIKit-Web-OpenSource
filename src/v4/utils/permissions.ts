// // TODO: refactor to align with SDK roles once available.
import { MemberRoles } from '~/social/constants';
import { isCommunityMember, isCommunityPost, isPostUnderReview } from '~/helpers/utils';

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
