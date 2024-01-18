import { ChannelRepository } from '@amityco/ts-sdk';

export const addChatMembers = async (channelId: string, userIds: string[]) => {
  return ChannelRepository.Membership.addMembers(channelId, userIds);
};
