import useMessagesCollection from './collections/useMessagesCollection';

function useMessagesList(channelId: string) {
  const { messages, hasMore, loadMore } = useMessagesCollection(channelId);

  return [messages, hasMore, loadMore];
}

export default useMessagesList;
