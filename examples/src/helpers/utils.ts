import {
  CommentRepository,
  CommunityPostSettings,
  CommunityRepository,
  FeedRepository,
} from '@amityco/ts-sdk';
import isEmpty from 'lodash/isEmpty';

export type Mentioned = {
  userId: string;
  length: number;
  index: number;
  type: string;
  displayName: string;
};
export type Mentionees = Amity.UserMention[];
export type Metadata = {
  mentioned?: Mentioned[];
};

/**
 *
 * @deprecated
 */
export function stripUndefinedValues(obj: any) {
  const out = { ...obj };

  Object.entries(out).forEach(([key, value]) => {
    if (value === undefined) {
      delete out[key];
    }
  });

  return out;
}

export function isCommunityMember(member?: Amity.Member<'community'>) {
  return member?.communityMembership === 'member';
}

export function isCommunityPost(post?: Amity.Post) {
  return post?.targetType === 'community';
}

export function isPostUnderReview(post?: Amity.Post, community?: Amity.Community | null) {
  if (community?.postSetting === CommunityPostSettings.ANYONE_CAN_POST) {
    return false;
  }
  return true;
}

export function isPrivateNetwork(socialSettings?: Amity.SocialSettings | null) {
  return (socialSettings?.userPrivacySetting as any) === 'private';
}

// Because community users have another type
export function formatCommunityMentionees(mentionees: Amity.User[], users: Amity.User[]) {
  return (mentionees || []).map((mentionee) => {
    const user = users.find(({ userId }) => userId === mentionee.userId);
    if (user == null) return null;
    return {
      id: user.userId,
      display: user.displayName,
      avatar: user.avatarCustomUrl,
    };
  });
}

export function formatMentionees(users: Amity.User[] | undefined) {
  return (users || []).map((user, index) => ({
    id: user.userId,
    display: user.displayName ?? user.userId,
    avatar: user.avatarCustomUrl,
    isLastItem: users?.length === index + 1,
  }));
}

export function searchWords(mentionees: Mentionees) {
  // Prolly need to dissect this on upper level TextContent
  return mentionees?.length ? mentionees[0].userIds.map((userId) => `@${userId}`) : [];
}

const AT_SIGN_LENGTH = 1;

export function extractDisplayName(
  text: string,
  displayNameLength: number,
  startOfMention: number,
) {
  const startOfName = startOfMention + AT_SIGN_LENGTH;
  const endOfName = startOfName + displayNameLength;

  return text.substring(startOfName, endOfName);
}

export function findChunks(mentionees?: Mentioned[]) {
  if (!mentionees) return [];

  const mentioneeChunks = mentionees
    .sort((m1, m2) => m1.index - m2.index)
    .map(({ index, length }) => ({
      start: index,
      end: index + length + AT_SIGN_LENGTH,
      highlight: true,
    }));

  return mentioneeChunks;
}

export function extractMetadata(
  mentions: { plainTextIndex: number; id: string; display: string }[],
) {
  const metadata: Metadata = {};
  const mentionees: Mentionees = [];

  if (mentions?.length > 0) {
    metadata.mentioned = [
      ...mentions
        .sort((m1, m2) => m1.plainTextIndex - m2.plainTextIndex)
        .map(({ plainTextIndex, id, display: displayName }) => ({
          index: plainTextIndex,
          length: displayName.length - AT_SIGN_LENGTH,
          type: 'user',
          userId: id,
          displayName,
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

export function parseMentionsMarkup(
  text?: string,
  metadata?: { mentioned?: Array<{ userId: string; length: number; index: number; type: string }> },
) {
  if (!text) return text;

  if (isEmpty(metadata?.mentioned)) {
    return text;
  }

  let parsedText = text;

  ((metadata || {}).mentioned || [])
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

export function isNonNullable<TValue>(value: TValue | undefined | null): value is TValue {
  return value != null;
}

export function reconstructMentions(
  metadata?: Metadata,
  mentionees?: Mentionees,
): { plainTextIndex: number; id: string; display: string }[] {
  if (!metadata?.mentioned || mentionees?.length === 0) {
    return [];
  }

  const userIds = mentionees?.find((mentionee) => mentionee.type === 'user')?.userIds || [];

  return metadata?.mentioned?.map((mention, index) => {
    const id = userIds[index];
    const displayName = mention.displayName;
    const display = '@' + (displayName ?? id);

    return {
      plainTextIndex: mention.index,
      id,
      display,
    };
  });
}
