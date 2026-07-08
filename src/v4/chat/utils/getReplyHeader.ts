import { resolveString } from '~/v4/core/localization';

type GetReplyHeaderParams = {
  child: Amity.Message;
  parent: Amity.Message;
  currentUserId: string | null | undefined;
  isGroupChat: boolean;
};

function getDisplayName(message: Amity.Message): string {
  const name = (message as unknown as { creator?: { displayName?: string } }).creator?.displayName;
  return name && name.length > 0 ? name : resolveString('amity_chat_unknown_user');
}

export function getReplyHeader({
  child,
  parent,
  currentUserId,
  isGroupChat,
}: GetReplyHeaderParams): string {
  const isCurrentUser = !!currentUserId && child.creatorId === currentUserId;
  const isParentCurrentUser = !!currentUserId && parent.creatorId === currentUserId;
  const isParentDeleted = parent.isDeleted === true;

  if (isParentDeleted) {
    return isCurrentUser
      ? resolveString('amity_chat_reply_you_to_deleted')
      : resolveString('amity_chat_reply_to_deleted');
  }

  if (!isGroupChat) {
    if (isParentCurrentUser) {
      return isCurrentUser
        ? resolveString('amity_chat_reply_you_to_yourself')
        : resolveString('amity_chat_reply_to_you');
    }
    return isCurrentUser
      ? resolveString('amity_chat_reply_you')
      : resolveString('amity_chat_reply_to_themself');
  }

  const childName = getDisplayName(child);
  const parentName = getDisplayName(parent);

  if (isParentCurrentUser) {
    return isCurrentUser
      ? resolveString('amity_chat_reply_you_to_yourself')
      : resolveString('amity_chat_reply_name_to_you', childName);
  }
  if (isCurrentUser) {
    return resolveString('amity_chat_reply_you_to_name', parentName);
  }
  if (parent.creatorId === child.creatorId) {
    return resolveString('amity_chat_reply_name_to_themself', childName);
  }
  return resolveString('amity_chat_reply_name_to_name', childName, parentName);
}
