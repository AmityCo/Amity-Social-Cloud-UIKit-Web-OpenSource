import { ChannelRepository } from '@amityco/js-sdk';

export const removeChatMembers = async (channelId, userIds) => {
  return ChannelRepository.removeMembers({ channelId, userIds });
};
