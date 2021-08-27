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
