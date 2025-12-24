import React, { useState, useCallback } from 'react';
import {
  LivestreamHeader,
  LivestreamHeaderProps,
} from '~/v4/social/features/livestream/internal-components/LivestreamStage/LivestreamHeader/LivestreamHeader';

import { LivestreamPreviewStage } from './LivestreamPreviewStage';
import { StreamerStage } from './StreamerStage';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import { useLivestreamTimer, useLeaveRoom } from '~/v4/social/features/livestream/hooks';
import { LivestreamOverlay } from '~/v4/social/features/livestream/internal-components/LivestreamOverlay';
import styles from './LivestreamStage.module.css';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';

export type LivestreamUiState = 'preview' | 'broadcast' | 'backStage' | 'player';

export interface LivestreamStageProps {
  // Core properties
  pageId: string;
  targetType: 'user' | 'community';
  targetId?: string | null;

  // UI state
  uiState: LivestreamUiState;

  // Community data
  community?: Amity.Community | null;

  // Settings
  readOnly?: boolean;
  setReadOnly?: (readOnly: boolean) => void;

  // Event handlers
  onClose: () => void;
  onTargetSelection?: () => void;
  onStreamEnd?: () => void; // Callback when stream ends due to time limit

  // Device management - passed from parent since it's also needed for permissions
  deviceManagement: ReturnType<typeof useDeviceManagement>;

  isCoHost?: boolean;
  isStarting?: boolean;
  isEnding?: boolean;

  broadcasterData?: Amity.BroadcasterData;

  onLeaveStreamStage?: (isSessionEnded?: boolean) => void;
  onLeaveByKickout?: () => void;

  event?: Amity.Event;
}

export const LivestreamStage: React.FC<LivestreamStageProps> = ({
  pageId,
  targetType,
  targetId,
  uiState,
  community,
  readOnly,
  setReadOnly,
  onClose,
  onTargetSelection,
  onStreamEnd,
  isStarting,
  deviceManagement,
  isCoHost,
  isEnding,
  broadcasterData,
  onLeaveStreamStage,
  onLeaveByKickout,
  event,
}) => {
  // Internal countdown state - moved to parent for overlay management
  const [showCountdownOverlay, setShowCountdownOverlay] = useState(false);
  const [coHostLeaveHandler, setCoHostLeaveHandler] = useState<(() => void) | null>(null);
  const { room, channel, livestreamPost } = useLivestreamData();
  const { confirm } = useConfirmContext();

  // Countdown timer for the overlay (10 seconds only)
  const { remainingSeconds } = useLivestreamTimer({
    isActive: showCountdownOverlay,
    mode: 'countDown',
    countdownFrom: 10, // 10 seconds
    onComplete: () => {
      // Call parent callback to end the stream
      onStreamEnd?.();
      setShowCountdownOverlay(false);
    },
  });

  const handleLeaveBackStage = () => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => {
        // In case of co-host is leaving the back stage, the ui will be changed back to player
        onLeaveStreamStage?.();
      },
      okText: 'Leave',
      cancelText: 'Cancel',
      title: 'Leave backstage',
      pageId,
      content:
        "Are you sure you want to leave backstage? You'll return to viewer mode and need a new invite to rejoin.",
    });
  };

  const handleCoHostLeaveStage = () => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => {
        coHostLeaveHandler?.();
        onLeaveStreamStage?.(true);
        onClose();
      },
      okText: 'Leave',
      cancelText: 'Cancel',
      title: 'Leave live stream',
      pageId,
      content:
        'Are you sure you want to leave this livestream? You’ll stop broadcasting and exit the session completely.',
    });
  };

  // Calculate countdown display
  const countdownDisplay = remainingSeconds > 0 ? remainingSeconds : null;
  // Computed values
  const isTargetEvent = !!event;

  // Header props - consolidated internally
  const headerProps: LivestreamHeaderProps = {
    pageId,
    isTargetEvent,
    targetType,
    community,
    uiState,
    readOnly,
    isCoHost,
    setReadOnly,
    event,
    onClose: () => {
      // 1. Co-host leave back stage, leave room + change ui back to player
      if (isCoHost && uiState === 'backStage') return handleLeaveBackStage();
      // 2. Host leave stage, stop room
      if (!isCoHost) return onClose();
      // 3. Co-host leave broadcast stage, leave livekit room, leave room, change ui back to player
      if (isCoHost && uiState === 'broadcast' && coHostLeaveHandler) {
        return handleCoHostLeaveStage();
      }

      return onClose();
    },
    onTargetSelection,
    onStreamEnd,
    showCountdownOverlay,
    setShowCountdownOverlay,
    isLive: room?.status === 'live',
  };

  return (
    <div className={styles.livestreamStage}>
      <LivestreamHeader {...headerProps} />
      {(uiState === 'preview' || uiState === 'backStage') && (
        <LivestreamPreviewStage deviceManagement={deviceManagement} />
      )}
      {uiState === 'broadcast' && broadcasterData && room && (
        <StreamerStage
          pageId={pageId}
          deviceManagement={deviceManagement}
          broadcasterData={broadcasterData}
          onLeaveStreamStage={onLeaveStreamStage}
          onLeaveByKickout={onLeaveByKickout}
          onCoHostLeaveRequest={(handler) => setCoHostLeaveHandler(() => handler)}
        />
      )}
      {livestreamPost?.feedType === 'reviewing' && (
        <LivestreamOverlay.WaitForApproval view="streamer" />
      )}
      {isStarting && <LivestreamOverlay.Starting />}
      {isEnding && <LivestreamOverlay.Ending />}
      {showCountdownOverlay && countdownDisplay && (
        <LivestreamOverlay.CountdownEnding countdown={countdownDisplay} />
      )}
      {uiState === 'broadcast' && channel?.attachedTo?.roomId && room?.post && (
        <ReactionFloating post={room?.post as Amity.Post} />
      )}
    </div>
  );
};
