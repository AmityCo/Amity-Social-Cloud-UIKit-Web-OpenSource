import { CommunityUserMembership, PostTargetType } from '@amityco/js-sdk';

export function stripUndefinedValues(obj) {
  const out = { ...obj };

  Object.entries(out).forEach(([key, value]) => {
    if (value === undefined) {
      delete out[key];
    }
  });

  return out;
}

export function isCommunityMember(communityUser) {
  return communityUser?.communityMembership === CommunityUserMembership.Member;
}

export function isCommunityPost(post) {
  return post.targetType === PostTargetType.CommunityFeed;
}

export function isPostUnderReview(post, community) {
  return (
    !!community.reviewingFeed?.feedId &&
    !!post.feedId &&
    community.reviewingFeed?.feedId === post.feedId
  );
}

export function isPrivateNetwork(networkSettings) {
  return networkSettings?.social?.userPrivacySetting === 'private';
}

export function randomString(length) {
  return Math.random()
    .toString(36)
    .slice(length);
}

// Because community users have another type
export function formatCommunityMentionees(mentionees, users) {
  return mentionees.map(mentionee => {
    const user = users.find(({ userId }) => userId === mentionee.userId);
    return {
      id: user.userId,
      display: user.displayName,
      avatar: user.avatarCustomUrl,
    };
  });
}

export function formatMentionees(users) {
  return users.map((user, index) => ({
    id: user.userId,
    display: user.displayName,
    avatar: user.avatarCustomUrl,
    isLastItem: users?.length === index + 1,
  }));
}

// export function searchWords(textVal) {
//   return textVal.match(/\B@([\w-]+)/gim);
// }

export function searchWords(mentionees) {
  // Prolly need to dissect this on upper level TextContent
  return mentionees?.length ? mentionees[0].userIds.map(userId => `@${userId}`) : [];
}
