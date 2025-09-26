import { ChannelRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

// TODO: breaking change

export default function useChannelMembersCollection(channelId?: string) {
  const { items, ...rest } = useLiveCollection({
    fetcher: ChannelRepository.Membership.getMembers,
    params: { channelId: channelId as string, includeDeleted: false },
    shouldCall: () => !!channelId,
  });

  return {
    channelMembers: items,
    ...rest,
  };
}
