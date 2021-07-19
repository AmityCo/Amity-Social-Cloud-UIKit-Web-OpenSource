import { ChannelRepository, ChannelType, DataStatus } from '@amityco/js-sdk';
import { v4 as uuidV4 } from 'uuid';

function getChannelId(userIds) {
  return userIds.sort().join('-');
}

function setDisplayName(channelId, { isDirectChat, chatName }) {
  if (isDirectChat) return;
  ChannelRepository.setDisplayName({ channelId, displayName: chatName });
}

function setMetadata(channelId, { isDirectChat }) {
  if (!isDirectChat) return;
  ChannelRepository.setMetadata({ channelId, metadata: { isDirectChat } });
}

export function createNewChat({
  onChatCreated = () => {},
  onChannelIdCreated = () => {},
  defaultChatTags = [],
  ...options
}) {
  const { isDirectChat, chatName, userIds, currentUserId } = options;

  if (userIds.length === 0) return;

  if (!isDirectChat && !chatName) return;

  // Use same pattern with mobile patform to sort and concat all userId to make channel Id is unique
  const newChannelId = isDirectChat ? getChannelId([userIds, currentUserId]) : uuidV4();

  const newChatLiveObject = ChannelRepository.createChannel({
    channelId: newChannelId,
    type: ChannelType.Community,
    userIds: isDirectChat ? [userIds[0]] : userIds,
  });

  // Fire when channelId already generated
  onChannelIdCreated(newChannelId);

  // Decorate a new chat with metadata after creation
  newChatLiveObject.on('dataStatusChanged', ({ newValue }) => {
    onChatCreated({ channelId: newChannelId });

    if (DataStatus.Fresh !== newValue) return;

    newChatLiveObject.dispose();

    setDisplayName(newChannelId, options);
    setMetadata(newChannelId, options);

    // Send this tag same as mobile
    if (defaultChatTags) {
      ChannelRepository.setTags({ channelId: newChannelId, tags: defaultChatTags });
    }
  });
}
