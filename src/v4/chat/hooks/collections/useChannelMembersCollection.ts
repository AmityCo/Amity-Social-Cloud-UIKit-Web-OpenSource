import { ChannelRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof ChannelRepository.Membership.getMembers>[0];

export function useChannelMembersCollection(params: Params) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Membership<'channel'>, Params>({
    fetcher: ChannelRepository.Membership.getMembers,
    params,
    shouldCall: !!params.channelId,
  });

  return {
    ...rest,
    members: items,
  };
}
