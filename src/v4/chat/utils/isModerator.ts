import { MODERATOR_ROLES } from '~/v4/chat/constants/memberRoles';

export function hasModeratorRole(roles?: string[]): boolean {
  if (!roles || roles.length === 0) return false;
  return roles.some((role) => (MODERATOR_ROLES as readonly string[]).includes(role));
}
