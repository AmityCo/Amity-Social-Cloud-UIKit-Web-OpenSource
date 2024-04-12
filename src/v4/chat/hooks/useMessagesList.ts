import useMessagesCollection from './collections/useMessagesCollection';

function useMessagesList(channelId: string) {
  const { messages, hasMore, loadMore } = useMessagesCollection({
    subChannelId: channelId,
    sortBy: 'segmentDesc',
    limit: 20,
  });

  return [messages, hasMore, loadMore];
}

export default useMessagesList;
