import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { ChannelRepository } from '@amityco/ts-sdk';

type Params = Parameters<typeof ChannelRepository.Membership.searchMembers>[0] & {
  searchBy?: Amity.SearchUsersBy[];
};

export const useSearchChannelUsersCollection = ({
  channelId,
  memberships,
  search,
  searchBy,
  limit = 20,
  shouldCall = true,
}: {
  channelId?: Amity.Channel['channelId'];
  memberships: Amity.QueryChannelMembers['memberships'];
  limit?: number;
  search?: string | null;
  searchBy?: Amity.SearchUsersBy[];
  shouldCall?: boolean;
}) => {
  const { items, ...rest } = useLiveCollection<Amity.Membership<'channel'>, Params>({
    fetcher: ChannelRepository.Membership.searchMembers,
    params: {
      channelId: channelId!,
      search: search || '',
      searchBy,
      memberships,
      limit,
      includeDeleted: false,
    },
    shouldCall: !!channelId && shouldCall,
  });

  return {
    channelMembers: items,
    ...rest,
  };
};
