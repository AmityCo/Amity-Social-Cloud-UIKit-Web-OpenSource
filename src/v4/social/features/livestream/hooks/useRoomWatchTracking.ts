import { useEffect, useRef, useCallback } from 'react';
import { liveStreamStatus } from '~/v4/social/constants/livestream';

interface UseRoomWatchTrackingParams {
  room?: Amity.Room | null;
  currentUserId?: string | null;
  isViewer: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

// Type guard to check if room has analytics capability
interface RoomWithAnalytics extends Amity.Room {
  analytics(): {
    createWatchSession(startedAt: Date): Promise<string>;
    updateWatchSession(sessionId: string, duration: number, endedAt: Date): Promise<void>;
    syncPendingWatchSessions(): void;
  };
}

function hasAnalytics(room: Amity.Room | null | undefined): room is RoomWithAnalytics {
  return !!room && typeof (room as any).analytics === 'function';
}

/**
 * Hook to track watch minutes for viewers in live and recorded rooms.
 * Automatically creates sessions, updates duration, and syncs data.
 */
export const useRoomWatchTracking = ({
  room,
  currentUserId,
  isViewer,
  videoRef,
}: UseRoomWatchTrackingParams) => {
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTrackingRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const roomRef = useRef<Amity.Room | null | undefined>(room);

  // Update room ref whenever room changes
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Start tracking watch session
  const startTracking = useCallback(async () => {
    if (!room || !currentUserId || !isViewer) return;
    if (isTrackingRef.current) return; // Already tracking

    const isWatchable =
      room.status === liveStreamStatus.live || room.status === liveStreamStatus.recorded;

    if (!isWatchable) return;

    if (!hasAnalytics(room)) {
      return;
    }

    try {
      const analytics = room.analytics();
      const startTime = new Date();
      sessionIdRef.current = await analytics.createWatchSession(startTime);
      sessionStartTimeRef.current = startTime;
      isTrackingRef.current = true;

      // Start interval to update watch duration every second
      intervalRef.current = setInterval(async () => {
        // Prevent overlapping updates
        if (isUpdatingRef.current) return;

        if (sessionIdRef.current && sessionStartTimeRef.current) {
          isUpdatingRef.current = true;
          try {
            const duration = Math.floor(
              (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000,
            );
            await analytics.updateWatchSession(sessionIdRef.current, duration, new Date());
          } catch (error) {
            // Silently handle update errors
          } finally {
            isUpdatingRef.current = false;
          }
        }
      }, 1000);
    } catch (error) {
      isTrackingRef.current = false;
    }
  }, [room, currentUserId, isViewer]);

  // Stop tracking and perform final update
  const stopTracking = useCallback(
    async (shouldSync = false) => {
      if (!isTrackingRef.current) return;

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Perform final update
      if (room && sessionIdRef.current && sessionStartTimeRef.current && hasAnalytics(room)) {
        try {
          const analytics = room.analytics();
          const finalDuration = Math.floor(
            (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000,
          );
          await analytics.updateWatchSession(sessionIdRef.current, finalDuration, new Date());

          // Trigger sync if requested (e.g., on unmount)
          // Note: syncPendingWatchSessions() is fire-and-forget as per spec
          if (shouldSync) {
            analytics.syncPendingWatchSessions();
          }
        } catch (error) {
          // Silently handle stop errors
        }
      }

      // Reset state
      sessionIdRef.current = null;
      sessionStartTimeRef.current = null;
      isTrackingRef.current = false;
      isUpdatingRef.current = false;
    },
    [room],
  );

  // Subscribe to video player pause/play events
  useEffect(() => {
    if (!isViewer || !videoRef?.current) return;

    const handlePause = () => {
      stopTracking(true);
    };

    const handlePlay = () => {
      // Start tracking on play event
      startTracking();
    };

    const video = videoRef.current;
    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);

    return () => {
      stopTracking(true);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
    };
  }, [isViewer, videoRef, startTracking]);

  // Cleanup on component unmount - sync pending sessions
  useEffect(() => {
    return () => {
      // Stop tracking synchronously (clear intervals)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Perform final update and sync asynchronously (best effort)
      // We can't await in cleanup, but the SDK should handle this internally
      const currentRoom = roomRef.current;

      if (
        isTrackingRef.current &&
        currentRoom &&
        sessionIdRef.current &&
        sessionStartTimeRef.current &&
        hasAnalytics(currentRoom)
      ) {
        const analytics = currentRoom.analytics();
        const finalDuration = Math.floor(
          (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000,
        );

        // Fire and forget - best effort to update before unmount
        analytics
          .updateWatchSession(sessionIdRef.current, finalDuration, new Date())
          .then(() => {
            analytics.syncPendingWatchSessions();
          })
          .catch(() => {
            // Silently handle sync errors on unmount
          });

        // Reset state
        sessionIdRef.current = null;
        sessionStartTimeRef.current = null;
        isTrackingRef.current = false;
        isUpdatingRef.current = false;
      }
    };
  }, []);
};
