import { useEffect, useState } from 'react';
import useMessagesCollection from './collections/useMessagesCollection';

interface UseChannelLastMessageResult {
  lastMessage: Amity.Message<'text'> | null;
  isLoading: boolean;
}

export function useChannelLastMessage(channelId?: string): UseChannelLastMessageResult {
  const [lastMessage, setLastMessage] = useState<Amity.Message<'text'> | null>(null);

  const { messages, isLoading } = useMessagesCollection({
    subChannelId: channelId || '',
    limit: 1,
    sortBy: 'segmentDesc',
    includeDeleted: false,
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      setLastMessage(messages[0] as Amity.Message<'text'>);
    } else {
      setLastMessage(null);
    }
  }, [messages]);

  return {
    lastMessage,
    isLoading: isLoading && !channelId,
  };
}
