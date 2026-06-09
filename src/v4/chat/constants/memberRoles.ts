export enum MemberRoles {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  SUPER_MODERATOR = 'super-moderator',
  CHANNEL_MODERATOR = 'channel-moderator',
  COMMUNITY_MODERATOR = 'community-moderator',
}

export const MODERATOR_ROLES = [
  MemberRoles.MODERATOR,
  MemberRoles.COMMUNITY_MODERATOR,
  MemberRoles.CHANNEL_MODERATOR,
] as const;
