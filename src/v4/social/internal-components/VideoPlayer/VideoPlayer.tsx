import React, { useRef, useMemo, useEffect, useCallback, ForwardedRef, useState } from 'react';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus } from '~/social/constants';
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
import { Button } from '~/v4/core/components/AriaButton';

export interface VideoPlayerProps {
  fileId?: string;
  thumbnailFileId?: string;
  isMuted?: boolean;
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
  onTouchEnd?: React.TouchEventHandler<HTMLVideoElement>;
  onTouchMove?: React.TouchEventHandler<HTMLVideoElement>;
  onTouchStart?: React.TouchEventHandler<HTMLVideoElement>;
  onVolumeChange?: React.ReactEventHandler<HTMLVideoElement>;
  onClickProductTagBadge?: () => void;
  onDragging?: (val: boolean) => void;
  onClose?: () => void;
  onClickMute?: () => void;
  onClickMenu?: () => void;
  onClickVideo?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  fileId,
  thumbnailFileId,
  isMuted = false,
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
  onClose,
  onClickMute,
  onClickMenu,
  onClickVideo,
}) => {
  const { client } = useSDK();
  const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(fileId);
  const posterUrlFile = useFile(thumbnailFileId);
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const controlsRef = useRef<VideoPlayerControlsRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [internalMuted, setInternalMuted] = useState(isMuted);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(!autoPlay);

  // Callback ref to capture video element and trigger re-render
  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      internalVideoRef.current = node;
      if (externalVideoRef) {
        (externalVideoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
      }
      setVideoElement(node);
    },
    [externalVideoRef],
  );

  // Sync internal state with prop when prop changes
  useEffect(() => {
    setInternalMuted(isMuted);
  }, [isMuted]);

  // Track video play/pause state for mobile play button
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set initial state
    setIsPaused(video.paused);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoElement]);

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

  const posterUrl = useMemo(() => {
    if (directThumbnailUrl) return { fileUrl: directThumbnailUrl };
    return posterUrlFile;
  }, [directThumbnailUrl, posterUrlFile]);

  // Set up HLS for streaming
  const setupHls = useCallback(() => {
    if (!url || !videoRef.current || !useHls) return;

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hls = new Hls({
      debug: false,
      xhrSetup: (xhr) => {
        if (client?.token?.accessToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${client.token.accessToken}`);
        }
      },
    });

    hlsRef.current = hls;

    // Add error handling
    hls.on(Hls.Events.ERROR, (event, data) => {
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
  }, [url, useHls, client?.token?.accessToken]);

  useEffect(() => {
    if (useHls) {
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
  }, [url, useHls, setupHls]);

  const handleVideoAreaClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (onClickVideo) return onClickVideo(e);

      const video = videoRef.current;
      if (!video) return;
      controlsRef.current?.showControls();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    },
    [displayMode, onClickVideo],
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
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  if (url == null) return null;

  return (
    <div ref={containerRef} className={clsx(styles.videoPlayerWrapper, className)}>
      <video
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
        {!useHls && <source src={url} type="video/mp4" />}
        <p>
          Your browser does not support this format of video. Please try again later once the server
          transcodes the video into an playable format(mp4).
        </p>
      </video>
      <div
        className={styles.videoPlayerClickArea}
        onClick={handleVideoAreaClick}
        onMouseMove={handleMouseMove}
      />

      {displayMode === DisplayModeEnum.MOBILE ? (
        <>
          {showHeader && (
            <VideoHeader
              onClose={onClose}
              onClickMute={handleClickMute}
              onClickMenu={onClickMenu}
              isMuted={internalMuted}
            />
          )}

          {/* Play button for mobile mode */}
          {!hidePlayButton && isPaused && !isDragging && (
            <Button
              variant="default"
              className={styles.playButton}
              onPress={handlePlayButtonClick}
              icon={<Play />}
              iconClassName={styles.playButtonIcon}
            />
          )}

          <VideoProgressBar
            video={videoElement}
            isVisible={showProgressBar}
            isDragging={isDragging}
            onDragging={onDragging}
            showDurationOnDragOnly={showDurationOnDragOnly}
            productTags={productTags}
            onClickProductTagBadge={onClickProductTagBadge}
          />
        </>
      ) : (
        <VideoPlayerControls
          ref={controlsRef}
          videoRef={videoRef}
          pageId={pageId}
          productTags={productTags}
          postId={postId}
          onClickProductTagBadge={onClickProductTagBadge}
        />
      )}
    </div>
  );
};
