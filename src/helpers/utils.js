import isEmpty from 'lodash/isEmpty';
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
  return Math.random().toString(36).slice(length);
}

// Because community users have another type
export function formatCommunityMentionees(mentionees, users) {
  return mentionees.map((mentionee) => {
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
    display: user.displayName ?? user.userId,
    avatar: user.avatarCustomUrl,
    isLastItem: users?.length === index + 1,
  }));
}

export function searchWords(mentionees) {
  // Prolly need to dissect this on upper level TextContent
  return mentionees?.length ? mentionees[0].userIds.map((userId) => `@${userId}`) : [];
}

export function extractUserIdDisplayNameCollection(text, userId, highlightLength, index) {
  const startOfName = index + 1; // compensate @
  const endOfName = index + highlightLength + 1;
  const displayName = text.substring(startOfName, endOfName);

  return {
    displayName,
    userId,
  };
}

export function findChunks(mentionees) {
  if (!mentionees) return [];

  const mentioneeChunks = mentionees.map(({ index, length }) => ({
    start: index,
    end: index + length + 1, // compensate for index === 0
    highlight: true,
  }));

  return mentioneeChunks;
}

export function extractMetadata(markup, mentions) {
  const metadata = {};
  let mentionees = [
    {
      type: 'user',
      userIds: [],
    },
  ];

  if (mentions?.length > 0) {
    mentionees = [{}];

    metadata.mentioned = [
      ...mentions.map(({ plainTextIndex, id, display: displayName }) => ({
        index: plainTextIndex,
        length: displayName.length,
        type: 'user',
        userId: id,
      })),
    ];

    mentionees[0].type = 'user';
    mentionees[0].userIds = mentions.map(({ id }) => id);
  }

  return { metadata, mentionees };
}

export function parseMentionsMarkup(text, metadata) {
  if (isEmpty(metadata?.mentioned)) return text;

  let parsedText = text;
  const { mentioned } = metadata;

  mentioned.forEach(({ userId, length, index: textIndex }) => {
    const { displayName } = extractUserIdDisplayNameCollection(text, userId, length, textIndex);
    const markupFormat = `[${displayName}](${userId})`;

    parsedText = parsedText.replace(displayName, markupFormat);
  });

  return parsedText;
}
