import { useState, useEffect, useRef } from 'react';
import { ChannelRepository } from '@amityco/ts-sdk';

interface TotalUnreadData {
  unreadCount: number;
  isMentioned: boolean;
}

const useTotalUnreadCount = (channels: any[]) => {
  const [totalUnread, setTotalUnread] = useState<TotalUnreadData>({
    unreadCount: 0,
    isMentioned: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const unsubscriberRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscriberRef.current = ChannelRepository.getTotalChannelsUnread(
      ({ data: channelsUnread, loading: isLoading, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError);
          setLoading(false);
          return;
        }

        if (isLoading) {
          setLoading(true);
          return;
        }

        if (channelsUnread) {
          setTotalUnread({
            unreadCount: channelsUnread.unreadCount || 0,
            isMentioned: channelsUnread.isMentioned || false,
          });
        }

        setLoading(false);
      },
    );

    return () => {
      unsubscriberRef.current?.();
    };
  }, [channels.length]);

  return {
    totalUnread: totalUnread.unreadCount,
    isMentioned: totalUnread.isMentioned,
    loading,
    error,
  };
};

export default useTotalUnreadCount;
