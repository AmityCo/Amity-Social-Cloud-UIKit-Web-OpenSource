// TODO: refactor to align with SDK roles once available.
const MODERATOR_ROLE = 'moderator';

export const isModerator = userRoles => {
  if (!userRoles?.length) return false;
  return userRoles.includes(MODERATOR_ROLE);
};
