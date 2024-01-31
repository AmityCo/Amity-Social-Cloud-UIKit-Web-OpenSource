import useMessagesCollection from './collections/useMessagesCollection';

function useMessagesList(channelId: string) {
  const { messages, hasMore, loadMore } = useMessagesCollection({
    subChannelId: channelId,
    sortBy: 'segmentDesc',
  });

  return [messages, hasMore, loadMore];
}

export default useMessagesList;
