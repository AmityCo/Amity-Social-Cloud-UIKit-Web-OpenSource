import { ChannelRepository } from '@amityco/ts-sdk';

export const removeChatMembers = async (channelId: string, userIds: string[]) => {
  return ChannelRepository.Membership.removeMembers(channelId, userIds);
};
