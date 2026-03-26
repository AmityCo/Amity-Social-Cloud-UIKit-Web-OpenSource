import { useEffect } from 'react';
import { RoomPresenceRepository } from '@amityco/ts-sdk';

interface UseSyncWatchingHeartbeatParams {
  roomId?: string;
  enabled?: boolean;
}

export const useSyncWatchingHeartbeat = ({
  roomId,
  enabled = true,
}: UseSyncWatchingHeartbeatParams): null => {
  useEffect(() => {
    if (roomId && enabled) RoomPresenceRepository.startHeartbeat(roomId);

    return () => {
      if (roomId) RoomPresenceRepository.stopHeartbeat(roomId);
    };
  }, [roomId, enabled]);

  return null;
};
