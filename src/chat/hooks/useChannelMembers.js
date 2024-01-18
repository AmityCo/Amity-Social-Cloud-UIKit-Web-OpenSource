import { ChannelRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

function useChannelMembers(channelId, memberCount) {
  const [members, hasMore, loadMore] = useLiveCollection(
    () => ChannelRepository.queryMembers({ channelId }),
    [channelId, memberCount],
  );

  return [members, hasMore, loadMore];
}

export default useChannelMembers;
