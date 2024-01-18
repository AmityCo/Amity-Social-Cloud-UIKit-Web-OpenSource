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

const AT_SIGN_LENGTH = 1;

export function extractDisplayName(text, displayNameLength, startOfMention) {
  const startOfName = startOfMention + AT_SIGN_LENGTH;
  const endOfName = startOfName + displayNameLength;

  return text.substring(startOfName, endOfName);
}

export function findChunks(mentionees) {
  if (!mentionees) return [];

  const mentioneeChunks = mentionees.map(({ index, length }) => ({
    start: index,
    end: index + length + AT_SIGN_LENGTH,
    highlight: true,
  }));

  return mentioneeChunks;
}

export function extractMetadata(mentions) {
  const metadata = {};
  const mentionees = [];

  if (mentions?.length > 0) {
    metadata.mentioned = [
      ...mentions.map(({ plainTextIndex, id, display: displayName }) => ({
        index: plainTextIndex,
        length: displayName.length - AT_SIGN_LENGTH,
        type: 'user',
        userId: id,
      })),
    ];

    mentionees.push({
      type: 'user',
      userIds: mentions.map(({ id }) => id),
    });
  } else {
    // to clean the mentionees on backend side
    mentionees.push({ type: 'user', userIds: [] });
  }

  return { metadata, mentionees };
}

export function parseMentionsMarkup(text, metadata) {
  if (isEmpty(metadata?.mentioned)) {
    return text;
  }

  let parsedText = text;

  [...metadata.mentioned]
    .sort((a, b) => b.index - a.index)
    .forEach(({ userId, length, index: textIndex }) => {
      const markupFormat = `@[${extractDisplayName(text, length, textIndex)}](${userId})`;

      parsedText = parsedText.replace(
        new RegExp(`(.{${textIndex}}).{${length + AT_SIGN_LENGTH}}`),
        `$1${markupFormat}`,
      );
    });

  return parsedText;
}
