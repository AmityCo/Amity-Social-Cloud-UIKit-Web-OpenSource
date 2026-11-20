import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import styles from './LivestreamPlayer.module.css';
import { Typography } from '~/v4/core/components';
import {
  LivestreamOverlay,
  LiveStreamTerminatedThumbnail,
  LiveStreamIdleThumbnail,
  LiveStreamEndThumbnail,
  LiveStreamBanThumbnail,
} from '~/v4/social/features/livestream/internal-components';
import { PlayIcon, PauseIcon } from '~/v4/icons';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { VideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { DisplayModeEnum } from '~/v4/social/types';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { TagProductsButton } from '~/v4/social/features/livestream/internal-components/TagProductsButton/TagProductsButton';
import { AmitySharableContentType } from '@amityco/ts-sdk';
import {
  useFeedVideoAutoplay,
  useFeedVideoSoundState,
} from '~/v4/social/features/feed-video-autoplay';

interface LivestreamPlayerProps {
  themeStyles?: React.CSSProperties;
  accessibilityId?: string;
  isLive: boolean;
  showWaitingApprovalBanner: boolean;
  isEnded: boolean;
  isTerminated: boolean;
  isUserBanned: boolean;
  isLoading: boolean;
  isPoorConnection: boolean;
  isRecorded?: boolean;
  pageId?: string;
  productTags: Amity.ProductTag[];
  onClickProductTagBadge: () => void;
  onClose?: () => void;
  canShowProductTags?: boolean;
  isPaused?: boolean;
  showControls?: boolean;
  onToggleControls?: () => void;
  onTogglePlayPause?: () => void;
}

export const LivestreamPlayer = forwardRef<HTMLVideoElement, LivestreamPlayerProps>(
  (
    {
      themeStyles,
      accessibilityId,
      isLive,
      showWaitingApprovalBanner,
      isEnded,
      isTerminated,
      isUserBanned,
      isLoading,
      isPoorConnection,
      isRecorded,
      pageId,
      productTags,
      onClickProductTagBadge,
      onClose,
      canShowProductTags = false,
      isPaused = false,
      showControls = false,
      onToggleControls,
      onTogglePlayPause,
    },
    ref,
  ) => {
    const { isDesktop } = useResponsive();
    const { room, livestreamPost } = useLivestreamData();
    const { setDrawerData, removeDrawerData } = useDrawer();
    const [isDragging, setIsDragging] = useState(false);
    const { getPlayback, savePlayback } = useFeedVideoAutoplay();
    const [isMuted, setIsMuted] = useFeedVideoSoundState(false);
    const recordedVideoRef = useRef<HTMLVideoElement>(null);
    const [nextSegment, setNextSegment] = useState<number>();
    const recordedUrls = useMemo(
      () =>
        (room?.recordedPlaybackInfos ?? [])
          .map((info) => info.url)
          .filter((url): url is string => !!url),
      [room?.recordedPlaybackInfos],
    );
    // The room loads after the first render, so read the feed position once its id is known.
    const recordedStart = useMemo(() => {
      const playback = room?.roomId ? getPlayback(room.roomId) : undefined;
      if (!playback || playback.isEnded) return { segment: 0, position: 0 };
      return { segment: playback.segment ?? 0, position: playback.position };
    }, [room?.roomId, getPlayback]);
    const segment = Math.min(
      nextSegment ?? recordedStart.segment,
      Math.max(0, recordedUrls.length - 1),
    );
    const recordedInitialTime = nextSegment === undefined ? recordedStart.position : 0;
    const isHidden = isEnded || isTerminated || isUserBanned;
    const recordedVideoUrl = recordedUrls[segment];

    useEffect(() => {
      const video = recordedVideoRef.current;
      const roomId = room?.roomId;
      if (!isRecorded || !video || !roomId) return;

      const isLastSegment = segment >= recordedUrls.length - 1;
      // Keep what the events last saw: on close the player is torn down and no longer reports `ended`.
      let playback =
        video.readyState === HTMLMediaElement.HAVE_NOTHING
          ? getPlayback(roomId)
          : { position: video.currentTime, isEnded: video.ended, segment };
      const savePosition = () => {
        if (video.readyState === HTMLMediaElement.HAVE_NOTHING) return;
        playback = { position: video.currentTime, isEnded: video.ended, segment };
        savePlayback(roomId, playback);
      };
      const handleEnded = () => {
        if (isLastSegment) {
          savePosition();
          return;
        }
        playback = { position: 0, isEnded: false, segment: segment + 1 };
        savePlayback(roomId, playback);
        setNextSegment(segment + 1);
      };

      video.addEventListener('timeupdate', savePosition);
      video.addEventListener('ended', handleEnded);
      return () => {
        video.removeEventListener('timeupdate', savePosition);
        video.removeEventListener('ended', handleEnded);
        if (playback) savePlayback(roomId, playback);
      };
    }, [
      isRecorded,
      recordedVideoUrl,
      room?.roomId,
      getPlayback,
      savePlayback,
      segment,
      recordedUrls.length,
    ]);

    const recordedThumbnailUrl = useMemo(() => {
      return room?.recordedPlaybackInfos?.[0]?.thumbnailUrl;
    }, [room?.recordedPlaybackInfos]);

    return (
      <>
        {isRecorded && recordedVideoUrl ? (
          <VideoPlayer
            key={segment}
            displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
            url={recordedVideoUrl}
            thumbnailUrl={recordedThumbnailUrl}
            useHls={!!recordedVideoUrl}
            autoPlay={true}
            isMuted={isMuted}
            initialTime={recordedInitialTime}
            externalVideoRef={recordedVideoRef}
            onClickMute={() => setIsMuted(!isMuted)}
            onSoundRefused={() => setIsMuted(true)}
            onReplay={segment > 0 ? () => setNextSegment(0) : undefined}
            pageId={pageId}
            productTags={productTags}
            postId={room?.post?.postId}
            className={styles.liveStreamPlayer__video}
            onClickProductTagBadge={onClickProductTagBadge}
            isDragging={isDragging}
            onDragging={(isDragging) => setIsDragging(isDragging)}
            onClose={() => {
              removeDrawerData();
              onClose?.();
            }}
            onClickMenu={() =>
              setDrawerData({
                content: (
                  <>
                    <CopyLinkButton
                      pageId={pageId}
                      model={AmitySharableContentType.POST}
                      referenceId={livestreamPost?.postId}
                      onDone={removeDrawerData}
                    />
                    {canShowProductTags && (
                      <TagProductsButton
                        pageId={pageId}
                        productTagCount={livestreamPost?.productTags?.length || 0}
                        onPress={onClickProductTagBadge}
                      />
                    )}
                  </>
                ),
              })
            }
          />
        ) : (
          <>
            <video
              id={room?.roomId}
              playsInline={true}
              className={styles.liveStreamPlayer__video}
              data-is-live={isLive}
              data-is-hidden={isHidden}
              ref={ref}
            />
            {isLive && (
              <div
                className={styles.liveStreamPlayer__tapCatcher}
                onClick={isDesktop ? onTogglePlayPause : onToggleControls}
                role="presentation"
              />
            )}
            {isLive && showControls && (
              <button
                type="button"
                aria-label={isPaused ? 'Play' : 'Pause'}
                className={styles.liveStreamPlayer__playPauseButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlayPause?.();
                }}
              >
                {isPaused ? (
                  <PlayIcon className={styles.liveStreamPlayer__playPauseIcon} />
                ) : (
                  <PauseIcon className={styles.liveStreamPlayer__playPauseIcon} fill="white" />
                )}
              </button>
            )}
            {isLive && isPaused && !isDesktop && (
              <div
                className={styles.liveStreamPlayer__pauseIndicator}
                role="status"
                aria-label="Paused"
              >
                <PauseIcon className={styles.liveStreamPlayer__pauseIndicatorIcon} />
                <Typography.CaptionBold className={styles.liveStreamPlayer__pauseIndicatorLabel}>
                  Paused
                </Typography.CaptionBold>
              </div>
            )}
          </>
        )}
        {showWaitingApprovalBanner && <LivestreamOverlay.WaitForApproval view="moderator" />}
        {isLoading && !isPoorConnection && isLive && !isEnded && !isUserBanned && (
          <LivestreamOverlay />
        )}
        {isLoading && isPoorConnection && isLive && <LivestreamOverlay.Reconnecting />}
        {isDesktop && isTerminated && <LiveStreamTerminatedThumbnail view="full-screen" />}
        {room?.status === liveStreamStatus.idle && <LiveStreamIdleThumbnail view="full-screen" />}
        {isUserBanned && <LiveStreamBanThumbnail />}
        {isEnded && !isTerminated && <LiveStreamEndThumbnail view="full-screen" />}
        {isLive && isDesktop && room?.post && <ReactionFloating post={room?.post as Amity.Post} />}
      </>
    );
  },
);
