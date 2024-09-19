import { CommunityPostSettings } from '@amityco/ts-sdk';
import isEmpty from 'lodash/isEmpty';

export type Mentioned = {
  userId?: string;
  length: number;
  index: number;
  type: string;
  displayName?: string;
};
export type Mentionees = (Amity.UserMention | Amity.ChannelMention)[];
export type Metadata = {
  mentioned?: Mentioned[];
};

type Chunk = { start: number; end: number; highlight?: boolean };

export const processChunks = (text: string, chunks: Chunk[] = []) => {
  const textLength = text?.length || 0;
  const allChunks: Chunk[] = [];

  const append = (start: number, end: number, highlight: boolean) => {
    allChunks.push({ start, end, highlight });
  };

  if (!chunks || chunks?.length === 0) {
    append(0, textLength, false);
  } else {
    let lastIndex = 0;
    chunks.forEach((chunk) => {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true);
      lastIndex = chunk.end;
    });
    append(lastIndex, textLength, false);
  }

  return allChunks;
};

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

  if (mentionees?.length) {
    if (Object.prototype.hasOwnProperty.call(mentionees[0], 'userIds')) {
      return (mentionees[0] as Amity.UserMention).userIds.map((userId) => `@${userId}`);
    }

    return ['@all'];
  }

  return [];
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
  const mentionees: (Amity.UserMention | Amity.ChannelMention)[] = [];

  if (mentions?.length > 0) {
    metadata.mentioned = [
      ...mentions
        .sort((m1, m2) => m1.plainTextIndex - m2.plainTextIndex)
        .map(({ plainTextIndex, id, display: displayName }) => {
          if (id === '@all') {
            return {
              index: plainTextIndex,
              length: displayName.length - AT_SIGN_LENGTH,
              type: 'channel',
            };
          }

          return {
            index: plainTextIndex,
            length: displayName.length - AT_SIGN_LENGTH,
            type: 'user',
            userId: id,
          };
        }),
    ];

    const isContainMentionAll = mentions.some(({ id }) => id === '@all');

    if (isContainMentionAll) {
      mentionees.push({ type: 'channel' } as Amity.ChannelMention);
    }

    mentionees.push({
      type: 'user',
      userIds: mentions.filter(({ id }) => id !== '@all').map(({ id }) => id),
    } as Amity.UserMention);
  } else {
    // to clean the mentionees on the backend side
    mentionees.push({ type: 'user', userIds: [] } as Amity.UserMention);
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

export function getCssVariableValue(variable: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

export function convertRemToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const SUPPORTED_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'sms:', 'tel:']);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank';
    }
  } catch {
    return url;
  }
  return url;
}

// Source: https://stackoverflow.com/a/8234912/2013580
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url: string): boolean {
  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  return url === 'https://' || urlRegExp.test(url);
}
