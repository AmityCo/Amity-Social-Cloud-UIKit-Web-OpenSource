import useChannelMembersCollection from './collections/useChannelMembersCollection';

// TODO: breaking change
function useChannelMembers(channelId?: string) {
  const { channelMembers, hasMore, loadMore } = useChannelMembersCollection(channelId);

  return [channelMembers, hasMore, loadMore];
}

export default useChannelMembers;
