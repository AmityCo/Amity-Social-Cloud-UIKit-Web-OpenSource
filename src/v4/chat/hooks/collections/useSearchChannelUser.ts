import useLiveCollection from '~/core/hooks/useLiveCollection';
import { ChannelRepository } from '@amityco/ts-sdk';

const useSearchChannelUser = (
  channelId: Amity.Channel['channelId'],
  memberships: Amity.QueryChannelMembers['memberships'],
  search?: string | null,
) => {
  const { items, ...rest } = useLiveCollection({
    fetcher: ChannelRepository.Membership.searchMembers,
    params: { channelId, search: search || '', memberships },
    shouldCall: () => !!channelId,
  });

  return {
    channelMembers: items,
    ...rest,
  };
};

export default useSearchChannelUser;
