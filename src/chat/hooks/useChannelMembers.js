import { ChannelMembershipRepository } from '@amityco/js-sdk';
import useLiveCollectionTemporaryIsolated from '~/core/hooks/useLiveCollectionTemporaryIsolated';

function useChannelMembers(channelId, memberCount) {
  const [members, hasMore, loadMore] = useLiveCollectionTemporaryIsolated(
    'userId',
    () => new ChannelMembershipRepository(channelId).members(),
    [channelId, memberCount],
  );

  return [members, hasMore, loadMore];
}

export default useChannelMembers;
