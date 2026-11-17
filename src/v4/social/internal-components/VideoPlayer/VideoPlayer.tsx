import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import useFile from '~/v4/core/hooks/useFile';

import styles from './VideoPlayer.module.css';
import {
  VideoPlayerControls,
  VideoPlayerControlsRef,
} from '~/v4/social/internal-components/VideoPlayerControls';
import { VideoProgressBar } from '~/v4/social/internal-components/VideoProgressBar';
import { VideoHeader } from '~/v4/social/internal-components/VideoHeader';
import clsx from 'clsx';
import Hls from 'hls.js';
import useSDK from '~/v4/core/hooks/useSDK';
import { DisplayMode, DisplayModeEnum } from '~/v4/social/types';
import { Play } from '~/v4/icons/Play';
import { Pause } from '~/v4/icons/Pause';
import { Backward10 } from '~/v4/icons/Backward10';
import { Forward10 } from '~/v4/icons/Forward10';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import { RotateLeft } from '~/v4/core/design/icons';
import { useString } from '~/v4/core/localization';
import { VIDEO_CONTROLS_AUTO_HIDE_MS } from '~/v4/social/constants';

enum VideoFileStatus {
  Uploading = 'uploading',
  Uploaded = 'uploaded',
  Transcoding = 'transcoding',
  Transcoded = 'transcoded',
  TranscodeFailed = 'transcodeFailed',
}

export interface VideoPlayerProps {
  fileId?: string;
  thumbnailFileId?: string;
  isMuted?: boolean;
  initialTime?: number;
  // The <video> renders only once the url is known, so a parent that listens to it needs this.
  onVideoElementChange?: (video: HTMLVideoElement | null) => void;
  pageId?: string;
  productTags?: Amity.ProductTag[];
  postId?: string;
  className?: string;
  autoPlay?: boolean;
  url?: string;
  thumbnailUrl?: string;
  useHls?: boolean;
  displayMode?: DisplayMode;
  isDragging?: boolean;
  externalVideoRef?: React.RefObject<HTMLVideoElement>;
  loop?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  style?: React.CSSProperties;
  showProgressBar?: boolean;
  showDurationOnDragOnly?: boolean;
  showHeader?: boolean;
  hidePlayButton?: boolean;
  hideSkipButtons?: boolean;
  showPauseButton?: boolean;
  isLive?: boolean;
  onTouchEnd?: React.TouchEventHandler<HTMLVideoElement>;
  onTouchMove?: React.TouchEventHandler<HTMLVideoElement>;
  onTouchStart?: React.TouchEventHandler<HTMLVideoElement>;
  onVolumeChange?: React.ReactEventHandler<HTMLVideoElement>;
  onClickProductTagBadge?: () => void;
  onDragging?: (val: boolean) => void;
  onClose?: () => void;
  onClickMute?: () => void;
  onSoundRefused?: () => void;
  onReplay?: () => void;
  onClickMenu?: () => void;
  onClickVideo?: (e: React.MouseEvent<HTMLElement>) => void;
}

function isPlayRefused(error: unknown) {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}

function isHlsUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return new URL(url, window.location.href).pathname.endsWith('.m3u8');
  } catch {
    return false;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  fileId,
  thumbnailFileId,
  isMuted = false,
  initialTime,
  onVideoElementChange,
  pageId,
  productTags = [],
  postId,
  className,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  onVolumeChange,
  autoPlay = false,
  url: directUrl,
  thumbnailUrl: directThumbnailUrl,
  useHls = false,
  onClickProductTagBadge,
  displayMode = DisplayModeEnum.DESKTOP,
  isDragging = false,
  onDragging = () => {},
  externalVideoRef,
  loop = false,
  playsInline = false,
  preload,
  style,
  showProgressBar = true,
  showDurationOnDragOnly = false,
  showHeader = true,
  hidePlayButton = false,
  hideSkipButtons = false,
  showPauseButton = true,
  isLive = false,
  onClose,
  onClickMute,
  onSoundRefused,
  onReplay,
  onClickMenu,
  onClickVideo,
}) => {
  const { client } = useSDK();
  const file: Amity.File<'video'> | undefined = useFile<'video'>(fileId);
  const posterUrlFile = useFile(thumbnailFileId);
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const controlsRef = useRef<VideoPlayerControlsRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [internalMuted, setInternalMuted] = useState(isMuted);
  const onSoundRefusedRef = useRef(onSoundRefused);
  onSoundRefusedRef.current = onSoundRefused;
  // Read once when hls.js starts, so a later initialTime change does not reload the stream.
  const initialTimeRef = useRef(initialTime);
  const hasCheckedSoundRef = useRef(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [desktopCenterIcon, setDesktopCenterIcon] = useState<'play' | 'pause' | null>(null);
  const [showMobileControls, setShowMobileControls] = useState(!autoPlay);
  const [isEnded, setIsEnded] = useState(false);
  const replayLabel = useString('amity_social_feed_video_replay');
  // Only a play the member started shows the pause feedback; an auto-play start stays clean.
  const isUserPlayRef = useRef(false);
  const desktopIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMobileHideTimer = useCallback(() => {
    if (mobileHideTimerRef.current) {
      clearTimeout(mobileHideTimerRef.current);
      mobileHideTimerRef.current = null;
    }
  }, []);

  const scheduleMobileHide = useCallback(() => {
    clearMobileHideTimer();
    mobileHideTimerRef.current = setTimeout(() => {
      setShowMobileControls(false);
    }, VIDEO_CONTROLS_AUTO_HIDE_MS);
  }, [clearMobileHideTimer]);

  // Callback ref to capture video element and trigger re-render
  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      internalVideoRef.current = node;
      if (externalVideoRef) {
        (externalVideoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
      }
      setVideoElement(node);
      onVideoElementChange?.(node);
    },
    [externalVideoRef, onVideoElementChange],
  );

  // Sync internal state with prop when prop changes
  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (!videoElement || !initialTime) return;
    // hls.js starts at initialTime itself (startPosition), so it can skip a gap before the first buffered frame.
    if (shouldUseHls && Hls.isSupported()) return;

    const seekToInitialTime = () => {
      videoElement.currentTime = initialTime;
    };

    if (videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
      seekToInitialTime();
      return;
    }
    videoElement.addEventListener('loadedmetadata', seekToInitialTime, { once: true });
    return () => videoElement.removeEventListener('loadedmetadata', seekToInitialTime);
  }, [videoElement]);

  // Track video play/pause state for mobile play button
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const clearDesktopIconTimer = () => {
      if (desktopIconTimerRef.current) {
        clearTimeout(desktopIconTimerRef.current);
        desktopIconTimerRef.current = null;
      }
    };
    const handlePlay = () => {
      const isUserPlay = isUserPlayRef.current;
      isUserPlayRef.current = false;
      setIsPaused(false);
      setIsEnded(false);
      clearDesktopIconTimer();
      if (!isUserPlay) {
        setDesktopCenterIcon(null);
        if (displayMode === DisplayModeEnum.MOBILE) {
          clearMobileHideTimer();
          setShowMobileControls(false);
        }
        return;
      }
      setDesktopCenterIcon('pause');
      desktopIconTimerRef.current = setTimeout(() => {
        setDesktopCenterIcon(null);
      }, VIDEO_CONTROLS_AUTO_HIDE_MS);
      if (displayMode === DisplayModeEnum.MOBILE) {
        scheduleMobileHide();
      }
    };
    const handleEnded = () => setIsEnded(true);
    const handleSeeking = () => setIsEnded(video.ended);
    const handlePause = () => {
      hasCheckedSoundRef.current = true;
      setIsPaused(true);
      clearDesktopIconTimer();
      setDesktopCenterIcon('play');
      if (displayMode === DisplayModeEnum.MOBILE) {
        setShowMobileControls(true);
        clearMobileHideTimer();
      }
    };

    // A blocked auto-play fires no pause event; it is still paused once it can play through.
    const showPaused = () => {
      setIsPaused(true);
      setDesktopCenterIcon('play');
      if (displayMode === DisplayModeEnum.MOBILE) setShowMobileControls(true);
    };
    const handleCanPlayThrough = () => {
      if (!autoPlay || !video.paused) return;
      if (!onSoundRefusedRef.current || video.muted || hasCheckedSoundRef.current) {
        showPaused();
        return;
      }
      hasCheckedSoundRef.current = true;
      video.play().catch((error: unknown) => {
        if (!isPlayRefused(error)) {
          showPaused();
          return;
        }
        video.muted = true;
        video
          .play()
          .then(() => {
            setInternalMuted(true);
            onSoundRefusedRef.current?.();
          })
          .catch(() => {
            video.muted = false;
            showPaused();
          });
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

    // Set initial state; an auto-play start counts as playing until it is known to be blocked.
    setIsPaused(video.paused && !autoPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      clearDesktopIconTimer();
      clearMobileHideTimer();
    };
  }, [videoElement, displayMode, autoPlay, scheduleMobileHide, clearMobileHideTimer]);

  // Prioritize direct URLs over fetched files
  const url = useMemo(() => {
    if (directUrl) return directUrl;
    if (file == null) return null;
    if (file.status === VideoFileStatus.Transcoded) {
      const { videoUrl } = file;
      return (
        videoUrl?.['1080p'] ||
        videoUrl?.['720p'] ||
        videoUrl?.['480p'] ||
        videoUrl?.['360p'] ||
        videoUrl?.original ||
        file.fileUrl
      );
    }
    return file.fileUrl;
  }, [directUrl, file]);

  const shouldUseHls = useHls || isHlsUrl(url);

  const posterUrl = useMemo(() => {
    if (directThumbnailUrl) return { fileUrl: directThumbnailUrl };
    return posterUrlFile;
  }, [directThumbnailUrl, posterUrlFile]);

  // Set up HLS for streaming
  const setupHls = useCallback(() => {
    if (!url || !videoRef.current || !shouldUseHls) return;

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hls = new Hls({
      debug: false,
      startPosition: initialTimeRef.current || -1,
      xhrSetup: (xhr) => {
        if (client?.token?.accessToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${client.token.accessToken}`);
        }
      },
    });

    hlsRef.current = hls;

    // Add error handling
    hls.on(Hls.Events.ERROR, (_event, data) => {
      console.error('❌ HLS Error:', {
        type: data.type,
        details: data.details,
        fatal: data.fatal,
      });

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('🌐 Fatal network error - trying to recover');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('🎬 Fatal media error - trying to recover');
            hls.recoverMediaError();
            break;
          default:
            console.error('💀 Fatal error - destroying HLS');
            hls.destroy();
            break;
        }
      }
    });

    if (Hls.isSupported()) {
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Browser has native HLS support
      videoRef.current.src = url;
    }
  }, [url, shouldUseHls, client?.token?.accessToken]);

  useEffect(() => {
    if (shouldUseHls) {
      setupHls();
    } else {
      videoRef.current?.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, shouldUseHls, setupHls]);

  const handleVideoAreaClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (onClickVideo) return onClickVideo(e);

      const video = videoRef.current;
      if (!video) return;

      if (displayMode === DisplayModeEnum.MOBILE) {
        setShowMobileControls((prev) => {
          const next = !prev;
          if (next && !video.paused) {
            scheduleMobileHide();
          } else {
            clearMobileHideTimer();
          }
          return next;
        });
        return;
      }

      controlsRef.current?.showControls();
      if (video.paused) {
        isUserPlayRef.current = true;
        video.play();
      } else {
        video.pause();
      }
    },
    [displayMode, onClickVideo, scheduleMobileHide, clearMobileHideTimer],
  );

  const handleMouseMove = useCallback(() => {
    // Only handle mouse move in desktop mode
    if (displayMode !== DisplayModeEnum.DESKTOP) return;
    controlsRef.current?.showControls();
  }, [displayMode]);

  const handleClickMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !internalMuted;
    video.muted = newMuted;
    setInternalMuted(newMuted);
    onClickMute?.();
  }, [onClickMute, internalMuted]);

  const handlePlayButtonClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      isUserPlayRef.current = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [displayMode]);

  const handleReplay = useCallback(() => {
    if (onReplay) {
      onReplay();
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [onReplay]);

  const handleSkipBackward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
    if (displayMode === DisplayModeEnum.MOBILE && !video.paused) {
      scheduleMobileHide();
    }
  }, [displayMode, scheduleMobileHide]);

  const handleSkipForward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const target = video.currentTime + 10;
    video.currentTime = isFinite(video.duration) ? Math.min(video.duration, target) : target;
    if (displayMode === DisplayModeEnum.MOBILE && !video.paused) {
      scheduleMobileHide();
    }
  }, [displayMode, scheduleMobileHide]);

  if (url == null) return null;

  return (
    <div ref={containerRef} className={clsx(styles.videoPlayerWrapper, className)}>
      <video
        data-testid="video-player"
        controlsList="nodownload"
        autoPlay={autoPlay}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        className={styles.fullImage}
        ref={videoCallbackRef}
        poster={posterUrl?.fileUrl}
        muted={internalMuted}
        style={style}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onVolumeChange={onVolumeChange}
      >
        {!shouldUseHls && <source src={url} type="video/mp4" />}
        <Typography.Body as="p">
          Your browser does not support this format of video. Please try again later once the server
          transcodes the video into an playable format(mp4).
        </Typography.Body>
      </video>
      <div
        className={styles.videoPlayerClickArea}
        onClick={handleVideoAreaClick}
        onMouseMove={handleMouseMove}
      />

      {displayMode === DisplayModeEnum.MOBILE ? (
        <>
          {showHeader && showMobileControls && (
            <VideoHeader
              onClose={onClose}
              onClickMute={handleClickMute}
              onClickMenu={onClickMenu}
              isMuted={internalMuted}
            />
          )}

          {/* Play + skip controls for mobile mode */}
          {!hidePlayButton &&
            showMobileControls &&
            (showPauseButton || isPaused) &&
            !isDragging && (
              <div className={styles.mobileControlsRow}>
                {!isLive && !hideSkipButtons && (
                  <Button
                    variant="default"
                    className={styles.skipButton}
                    onPress={handleSkipBackward}
                    icon={<Backward10 />}
                    iconClassName={styles.skipButtonIcon}
                    aria-label="Skip back 10 seconds"
                  />
                )}
                {isEnded ? (
                  <Button
                    variant="default"
                    className={clsx(styles.playButton, styles.replayButton)}
                    onPress={handleReplay}
                    icon={<RotateLeft />}
                    iconClassName={styles.playButtonIcon}
                    aria-label={replayLabel}
                  >
                    <Typography.CaptionBold className={styles.replayLabel}>
                      {replayLabel}
                    </Typography.CaptionBold>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className={styles.playButton}
                    onPress={handlePlayButtonClick}
                    icon={isPaused ? <Play /> : <Pause fill="white" />}
                    iconClassName={styles.playButtonIcon}
                    aria-label={isPaused ? 'Play' : 'Pause'}
                  />
                )}
                {!isLive && !hideSkipButtons && (
                  <Button
                    variant="default"
                    className={styles.skipButton}
                    onPress={handleSkipForward}
                    icon={<Forward10 />}
                    iconClassName={styles.skipButtonIcon}
                    aria-label="Skip forward 10 seconds"
                  />
                )}
              </div>
            )}

          <VideoProgressBar
            video={videoElement}
            isVisible={showProgressBar && showMobileControls}
            isDragging={isDragging}
            onDragging={onDragging}
            showDurationOnDragOnly={showDurationOnDragOnly}
            productTags={productTags}
            onClickProductTagBadge={onClickProductTagBadge}
          />
        </>
      ) : (
        <>
          {!hidePlayButton && isEnded && !isDragging && (
            <Button
              variant="default"
              className={clsx(styles.desktopCenterPlayButton, styles.replayButton)}
              onPress={handleReplay}
              icon={<RotateLeft />}
              iconClassName={styles.desktopCenterPlayButtonIcon}
              aria-label={replayLabel}
            >
              <Typography.CaptionBold className={styles.replayLabel}>
                {replayLabel}
              </Typography.CaptionBold>
            </Button>
          )}
          {!hidePlayButton && !isEnded && desktopCenterIcon && !isDragging && (
            <Button
              variant="default"
              className={styles.desktopCenterPlayButton}
              onPress={handlePlayButtonClick}
              icon={desktopCenterIcon === 'play' ? <Play /> : <Pause fill="white" />}
              iconClassName={styles.desktopCenterPlayButtonIcon}
              aria-label={desktopCenterIcon === 'play' ? 'Play' : 'Pause'}
            />
          )}
          <VideoPlayerControls
            ref={controlsRef}
            videoRef={videoRef}
            pageId={pageId}
            productTags={productTags}
            postId={postId}
            onClickProductTagBadge={onClickProductTagBadge}
            mutedOverride={internalMuted}
            onToggleMute={handleClickMute}
            autoPlay={autoPlay}
          />
        </>
      )}
    </div>
  );
};
