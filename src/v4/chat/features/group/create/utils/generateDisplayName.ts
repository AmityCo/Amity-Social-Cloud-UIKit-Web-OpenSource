import { resolveString } from '~/v4/core/localization/resolveString';

const MAX_LENGTH = 100;

export function generateDisplayName(users: Amity.User[]): string {
  if (users.length === 0) return '';

  let buffer = '';
  let isFirst = true;

  for (const user of users) {
    const displayName = user.displayName ?? resolveString('amity_chat_unknown_user');
    if (!isFirst) {
      if (buffer.length + 2 + displayName.length > MAX_LENGTH) break;
      buffer += ', ';
    } else {
      isFirst = false;
    }

    if (buffer.length + displayName.length <= MAX_LENGTH) {
      buffer += displayName;
    } else {
      const remaining = MAX_LENGTH - buffer.length;
      if (remaining > 0) buffer += displayName.slice(0, remaining);
      break;
    }
  }

  return buffer;
}
