import { ChannelRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';
import { MemberRoles } from '~/social/constants';

export default function useChannelModeratorsCollection(channelId?: string) {
  const { items, ...rest } = useLiveCollection({
    fetcher: ChannelRepository.Membership.getMembers,
    params: { channelId: channelId as string, roles: [MemberRoles.CHANNEL_MODERATOR] },
    shouldCall: () => !!channelId,
  });

  return {
    moderators: items,
    ...rest,
  };
}
