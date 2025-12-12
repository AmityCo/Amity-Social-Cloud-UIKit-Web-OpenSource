import React, { forwardRef } from 'react';
import styles from './LivestreamPlayer.module.css';
import {
  LivestreamOverlay,
  LiveStreamTerminatedThumbnail,
  LiveStreamIdleThumbnail,
  LiveStreamEndThumbnail,
  LiveStreamBanThumbnail,
} from '~/v4/social/features/livestream/internal-components';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';

interface LivestreamPlayerProps {
  themeStyles?: React.CSSProperties;
  accessibilityId?: string;
  isLive: boolean;
  showWaitingApprovalBanner: boolean;
  isDesktop: boolean;
  isEnded: boolean;
  isTerminated: boolean;
  isUserBanned: boolean;
  isLoading: boolean;
  isPoorConnection: boolean;
}

export const LivestreamPlayer = forwardRef<HTMLVideoElement, LivestreamPlayerProps>(
  (
    {
      themeStyles,
      accessibilityId,
      isLive,
      showWaitingApprovalBanner,
      isDesktop,
      isEnded,
      isTerminated,
      isUserBanned,
      isLoading,
      isPoorConnection,
    },
    ref,
  ) => {
    const { room } = useLivestreamData();

    return (
      <>
        <video
          id={room?.roomId}
          playsInline={true}
          className={styles.liveStreamPlayer__video}
          data-is-live={isLive}
          data-is-hidden={isEnded || isTerminated || isUserBanned}
          ref={ref}
        />
        {showWaitingApprovalBanner && <LivestreamOverlay.WaitForApproval view="moderator" />}
        {isLoading && !isPoorConnection && isLive && !isEnded && !isUserBanned && (
          <LivestreamOverlay />
        )}
        {isLoading && isPoorConnection && isLive && <LivestreamOverlay.Reconnecting />}
        {isDesktop && isTerminated && <LiveStreamTerminatedThumbnail />}
        {room?.status === liveStreamStatus.idle && <LiveStreamIdleThumbnail view="full-screen" />}
        {isUserBanned && <LiveStreamBanThumbnail />}
        {isEnded && !isTerminated && <LiveStreamEndThumbnail view="full-screen" />}
        {isLive && isDesktop && room?.post && <ReactionFloating post={room?.post as Amity.Post} />}
      </>
    );
  },
);
