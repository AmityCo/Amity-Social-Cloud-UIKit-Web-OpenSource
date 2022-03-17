import { ChannelMembershipRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

function useChannelMembers(channelId, memberCount) {
  const [members, hasMore, loadMore] = useLiveCollection(
    () => new ChannelMembershipRepository(channelId).members(),
    [channelId, memberCount],
  );

  return [members, hasMore, loadMore];
}

export default useChannelMembers;
