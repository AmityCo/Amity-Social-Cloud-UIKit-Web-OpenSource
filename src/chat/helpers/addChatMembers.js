import { ChannelRepository } from '@amityco/js-sdk';

export const addChatMembers = async (channelId, userIds) => {
  return ChannelRepository.addMembers({ channelId, userIds });
};
