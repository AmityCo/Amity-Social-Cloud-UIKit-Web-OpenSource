import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { ChannelRepository } from '@amityco/ts-sdk';

export const useSearchChannelUser = ({
  channelId,
  memberships,
  search,
  limit = 20,
  shouldCall = true,
}: {
  channelId: Amity.Channel['channelId'];
  memberships: Amity.QueryChannelMembers['memberships'];
  limit?: number;
  search?: string | null;
  shouldCall?: boolean;
}) => {
  const { items, ...rest } = useLiveCollection({
    fetcher: ChannelRepository.Membership.searchMembers,
    params: { channelId, search: search || '', memberships, limit, includeDeleted: false },
    shouldCall: !!channelId && shouldCall,
  });

  return {
    channelMembers: items,
    ...rest,
  };
};
