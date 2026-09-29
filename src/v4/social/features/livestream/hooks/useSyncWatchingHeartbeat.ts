import { useEffect } from 'react';
import { RoomPresenceRepository } from '@amityco/ts-sdk';
import { useSdkEffect } from '~/v4/core/hooks/useSdkEffect';

interface UseSyncWatchingHeartbeatParams {
  roomId?: string;
  enabled?: boolean;
}

export const useSyncWatchingHeartbeat = ({
  roomId,
  enabled = true,
}: UseSyncWatchingHeartbeatParams): null => {
  useSdkEffect(
    RoomPresenceRepository.startHeartbeat,
    () => {
      if (roomId && enabled) RoomPresenceRepository.startHeartbeat(roomId);

      return () => {
        if (roomId) RoomPresenceRepository.stopHeartbeat(roomId);
      };
    },
    [roomId, enabled],
  );

  return null;
};
