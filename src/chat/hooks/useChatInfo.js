/* eslint no-underscore-dangle: 0 */
import { FileRepository, ImageSize } from '@amityco/js-sdk';
import trim from 'lodash/trim';

import useUser from '~/core/hooks/useUser';
import { useSDK } from '~/core/hooks/useSDK';

const MEMBER_COUNT_PER_CASE = {
  DIRECT_CHAT: 2,
  ONLY_ME_CHAT: 1,
};

function getChatName(channel, otherUser) {
  // If direct have just only current user, will return just "ME"
  if (
    channel?.metadata?.isDirectChat &&
    channel?.memberCount === MEMBER_COUNT_PER_CASE.ONLY_ME_CHAT
  ) {
    return 'Me';
  }

  // Group chat will use displayName to show as a channel name
  if (!channel?.metadata?.isDirectChat && channel?.displayName) return channel?.displayName;

  // To default assume it is direct chat and use participant full name as channel name
  const { firstname = '', lastname = '' } = otherUser?.metadata ?? {};
  const fullName = trim(`${firstname}${lastname}`);

  return otherUser?.displayName || fullName || otherUser?.userId || channel.channelId;
}

/**
 * Channel use avatarFileId
 * User use avatarCustomUrl
 */
function getAvatarUrl({ avatarUrl, avatarFileId, avatarCustomUrl }) {
  if (avatarUrl) return avatarUrl;

  if (avatarCustomUrl) return avatarCustomUrl;

  if (avatarFileId) {
    return FileRepository.getFileUrlById({
      fileId: avatarFileId,
      imageSize: ImageSize.Medium,
    });
  }

  // not of all, just throw NULL
  return null;
}

function getChatAvatar(channel, otherUser, currentUser) {
  // It is direct chat but only one user - show current user instead
  if (channel?.memberCount === MEMBER_COUNT_PER_CASE.ONLY_ME_CHAT) {
    return getAvatarUrl(currentUser);
  }

  if (channel?.metadata?.isDirectChat && otherUser?.avatarUrl) {
    return getAvatarUrl(otherUser);
  }

  return getAvatarUrl(channel);
}

function useChatInfo({ channel }) {
  const { currentUserId, client } = useSDK();

  const otherUserId = channel?.metadata?.isDirectChat
    ? (channel?.metadata?.userIds ?? []).find((userId) => userId !== currentUserId)
    : null;

  const currentAvatarUrl = getAvatarUrl(client?._currentUser?.model);

  const {
    user: otherUser,
    file: { fileUrl: otherAvatarUrl },
  } = useUser(otherUserId);

  const chatName = getChatName(channel, otherUser);
  const chatAvatar = getChatAvatar(
    channel,
    { avatarUrl: otherAvatarUrl },
    { avatarUrl: currentAvatarUrl },
  );

  return { chatName, chatAvatar };
}

export default useChatInfo;
