import { useEffect, useRef } from 'react';
import { useDebounce } from 'react-use';
import { MARK_READ_DEBOUNCE_MS } from '~/v4/chat/constants';

type UseMarkAsReadParams = {
  latestMessage: Amity.Message | null;
  atBottom: boolean;
  enabled: boolean;
};

export function useMarkAsRead({ latestMessage, atBottom, enabled }: UseMarkAsReadParams) {
  const lastMarkedIdRef = useRef<string | null>(null);

  useDebounce(
    () => {
      if (!enabled || !atBottom || !latestMessage) return;
      const id = latestMessage.messageId;
      if (!id || lastMarkedIdRef.current === id) return;
      try {
        latestMessage.markRead();
        lastMarkedIdRef.current = id;
      } catch {
        // markRead failures are non-fatal; SDK will retry on the next visibility tick
      }
    },
    MARK_READ_DEBOUNCE_MS,
    [latestMessage?.messageId, atBottom, enabled],
  );

  useEffect(() => {
    lastMarkedIdRef.current = null;
  }, [latestMessage?.subChannelId]);
}
